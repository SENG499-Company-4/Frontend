import { BubbleChart, Code, DeveloperBoard, Engineering, Paid, Public, Science } from '@mui/icons-material';
import {
  Avatar,
  ButtonBase,
  Card,
  Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { Faculty } from 'constants/timetable.constants';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULE, GET_USER_BY_ID } from 'api/Queries';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { CoursePreference, CourseSection, Term, User } from 'types/api.types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getCoursesForProfessor } from 'utils/utils';

function ProfessorProfile() {
  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  const [professor, setProfessor] = useState<User>();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [currentlyTeaching, setCurrentlyTeaching] = useState<CourseSection[]>([]);
  const { id } = useParams();
  const paramId = id ? id : '-1';

  const {
    loading: userLoading,
    error: userError,
    data: userData
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: parseInt(paramId)
    }
  });

  const {
    loading: scheduleLoading,
    error: scheduleError,
    data: scheduleData
  } = useQuery(GET_SCHEDULE, {
    variables: {
      year: 2021, // TODO: UPDATE THIS TO GRAB CURRENT SCHEDULE
      term: Term.Fall // TODO: UPDATE THIS TO GRAB CURRENT SCHEDULE
    }
  });

  useEffect(() => {
    loadingContext.setLoading(userLoading);
    if (userData) {
      setProfessor(userData.findUserById);
    }
    if (userError) {
      errorContext.setErrorDialog(userError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, userError, userLoading]);

  useEffect(() => {
    loadingContext.setLoading(scheduleLoading);
    if (scheduleData && userData) {
      if (scheduleData.schedule) {
        setCurrentlyTeaching(getCoursesForProfessor(userData.findUserById.id, scheduleData.schedule.courses));
      }
    }
    if (scheduleError) {
      errorContext.setErrorDialog(scheduleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleLoading, scheduleData, scheduleError, userData, userError, userLoading]);

  const facultyIcons = {
    SENG: <Code />,
    CSC: <BubbleChart />,
    ECE: <DeveloperBoard />,
    ECON: <Paid />,
    ENGR: <Engineering />,
    PHYS: <Public />,
    CHEM: <Science />
  };

  // Dictionary to store background color given faculty
  const facultyColors = {
    SENG: '#ffc107',
    CSC: '#4caf50',
    ECE: '#2196f3',
    ECON: '#75B9BE',
    ENGR: '#F9B5AC',
    PHYS: '#EE7674',
    CHEM: '#987284'
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Course',
      flex: 1,
      renderCell: (params) => {
        return <strong>{params.row.id.subject + ' ' + params.row.id.code}</strong>;
      }
    },
    {
      field: 'term',
      headerName: 'Term',
      flex: 1,
      renderCell: (params) => {
        return params.row.id.term + ' ' + params.row.id.year;
      }
    },
    {
      field: 'preference',
      headerName: 'Preference',
      flex: 1
    }
  ];

  window.onresize = () => {
    setWindowWidth(window.innerWidth);
  };

  function getSkeletonWidth() {
    if (windowWidth < 1200) {
      return windowWidth - 100;
    } else {
      return 1150;
    }
  }

  return (
    <Grid display="flex" marginTop={4} justifyContent="center" padding={2} sx={{ width: '100%' }}>
      <Card elevation={10} sx={{ minHeight: '400px', maxWidth: '1200px', width: '100%' }}>
        {userLoading || scheduleLoading ? (
          <Grid id="skeleton-container" display={'flex'} flexDirection={'row'} margin={4} width={'100%'}>
            <Stack spacing={1}>
              <Skeleton variant="circular" width={100} height={100} />
              <Skeleton variant="text" width={getSkeletonWidth()} />
              <Skeleton variant="text" width={getSkeletonWidth()} />
              <Skeleton variant="text" width={getSkeletonWidth()} />
              <Skeleton variant="rectangular" width={getSkeletonWidth()} height={150} />
            </Stack>
          </Grid>
        ) : (
          <>
            <Grid display={'flex'} flexDirection={'row'} margin={4}>
              <Grid item mr={2}>
                <Avatar sx={{ bgcolor: '#3f80b5' }} />
              </Grid>
              <Grid item>
                <Typography variant="h4">
                  <b>{professor?.name}</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid display={'flex'} flexDirection={'row'} marginX={4} marginTop={4}>
              <Grid item>
                <Typography variant="body1" color={professor?.active ? 'green' : 'red'}>
                  <b>{professor?.active ? 'Active' : 'Inactive'}</b>
                </Typography>
                <Typography variant="body1">
                  <b>User ID: </b> {professor?.id}
                </Typography>
                <Typography variant="body1">
                  <b>Username: </b> {professor?.username}
                </Typography>
                <Typography variant="body1">
                  <b>Role: </b> {professor?.role}
                </Typography>
              </Grid>
            </Grid>
            <Divider variant="middle" sx={{ marginTop: '20px' }} />
            <Grid container display={'flex'} flexDirection={'row'}>
              <Grid
                item
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                padding={2}
              >
                <Grid item>
                  <Typography variant="h5" marginBottom={2}>
                    <b>Preferences</b>
                  </Typography>
                </Grid>
                <Grid item width={'100%'}>
                  {professor && professor?.preferences && professor?.preferences?.length > 0 ? (
                    <DataGrid
                      getRowId={(row) => {
                        return row.id.subject + row.id.code + row.id.term + row.id.year;
                      }}
                      loading={userLoading}
                      autoHeight
                      rows={professor?.preferences.filter((preference: CoursePreference) => {
                        return preference.preference > 0;
                      })}
                      style={{ width: '100%' }}
                      columns={columns}
                      rowsPerPageOptions={[5]}
                      pageSize={7}
                      disableSelectionOnClick
                      initialState={{
                        sorting: {
                          sortModel: [{ field: 'preference', sort: 'desc' }]
                        }
                      }}
                    />
                  ) : (
                    <Typography variant="body1">No preferences recorded.</Typography>
                  )}
                </Grid>
              </Grid>
              <Grid
                item
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                padding={2}
              >
                <Grid item>
                  <Typography variant="h5" marginBottom={1}>
                    <b>Currently Teaching</b>
                  </Typography>
                </Grid>
                {currentlyTeaching.length > 0 ? (
                  <Grid container spacing={2}>
                    {currentlyTeaching.map((course: CourseSection) => (
                      <Grid
                        item
                        key={course.CourseID.subject + course.CourseID.code}
                        marginY={1}
                        xs={12}
                        sm={6}
                        md={12}
                        lg={6}
                      >
                        <ButtonBase
                          onClick={() => {
                            navigate('/schedule/timetable', {
                              state: {
                                courseId: course.CourseID.subject + course.CourseID.code
                              }
                            });
                          }}
                          sx={{ display: 'block', textAlign: 'initial', width: '100%' }}
                        >
                          <Card elevation={5} sx={{ width: '100%' }}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: facultyColors[course.CourseID.subject as Faculty] }}>
                                  {facultyIcons[course.CourseID.subject as Faculty]}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={course.CourseID.subject + ' ' + course.CourseID.code}
                                secondary={course.startDate.split('T')[0] + ' - ' + course.endDate.split('T')[0]}
                              />
                            </ListItem>
                          </Card>
                        </ButtonBase>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1">This professor is currently not teaching a course.</Typography>
                )}
              </Grid>
            </Grid>
          </>
        )}
      </Card>
    </Grid>
  );
}

export default ProfessorProfile;
