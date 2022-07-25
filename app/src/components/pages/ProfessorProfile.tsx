import { BubbleChart, Code, DeveloperBoard, Engineering, Paid, Public, Science } from '@mui/icons-material';
import {
  Avatar,
  Button,
  ButtonBase,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { SUBMIT_SURVEY } from 'api/Mutations';
import { GET_SCHEDULE, GET_USER_BY_ID } from 'api/Queries';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { CoursePreference, CourseSection, Role, Term, User } from 'types/api.types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getCoursesForProfessor } from 'utils/utils';
import Cookie from 'universal-cookie';

function ProfessorProfile() {
  const navigate = useNavigate();
  const cookie = new Cookie();
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  const [doneRequests, setDoneRequests] = useState<boolean>(false);
  const [currentRequest, setCurrentRequest] = useState<Term>(Term.Spring);
  const [professor, setProfessor] = useState<User>();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [currentlyTeaching, setCurrentlyTeaching] = useState<CourseSection[]>([]);
  const [preferencesDialogOpen, setPreferencesDialogOpen] = useState<boolean>(false);
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
  const [fetchSchedule, { loading: scheduleLoading, error: scheduleError, data: scheduleData }] =
    useLazyQuery(GET_SCHEDULE);

  const [submitSurvey, { data: submitData, loading: submitLoading, error: submitError }] = useMutation(SUBMIT_SURVEY);

  useEffect(() => {
    loadingContext.setLoading(userLoading);
    if (userData) {
      let professorResponse = Object.assign({}, userData.findUserById);
      professorResponse.preferences = professorResponse.preferences.filter(
        (value: any, index: any, self: any) =>
          index ===
          self.findIndex(
            (t: any) => t.id.subject === value.id.subject && t.id.code === value.id.code && t.id.year === 2022
          )
      );
      setProfessor(professorResponse);
      fetchSchedule({
        variables: {
          year: 2022, // TODO: UNHACKIFY THIS
          term: Term.Spring // TODO: UNHACKIFY THIS
        }
      });
    }
    if (userError) {
      errorContext.setErrorDialog(userError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, userError, userLoading]);

  useEffect(() => {
    loadingContext.setLoading(scheduleLoading);
    if (scheduleData && userData) {
      if (scheduleData.schedule && !doneRequests) {
        const profCourses = getCoursesForProfessor(userData.findUserById.id, scheduleData.schedule.courses);
        let cur = currentlyTeaching.map((item) => {
          return item;
        });
        setCurrentlyTeaching(cur.concat(profCourses));
      }
      if (currentRequest === Term.Spring) {
        fetchSchedule({
          variables: {
            year: 2022, // TODO: UNHACKIFY THIS
            term: Term.Summer // TODO: UNHACKIFY THIS
          }
        });
        setCurrentRequest(Term.Summer);
      } else if (currentRequest === Term.Summer) {
        fetchSchedule({
          variables: {
            year: 2022, // TODO: UNHACKIFY THIS
            term: Term.Fall // TODO: UNHACKIFY THIS
          }
        });
        setCurrentRequest(Term.Fall);
      } else if (currentRequest === Term.Fall) {
        setDoneRequests(true);
      }
    }
    if (scheduleError) {
      errorContext.setErrorDialog(scheduleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleLoading, scheduleData, scheduleError, userData, userError, userLoading, doneRequests]);

  useEffect(() => {
    loadingContext.setLoading(submitLoading);
    if (submitData) {
      console.log('Preferences cleared successfully');
      window.location.reload();
    }
    if (submitError) {
      errorContext.setErrorDialog(submitError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitData, submitError, submitLoading]);

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

  function clearPreferences() {
    const values = {
      courses: [],
      fallTermCourses: null,
      springTermCourses: null,
      summerTermCourses: null,
      hasRelief: false,
      hasTopic: false,
      nonTeachingTerm: null,
      peng: false,
      reliefReason: null,
      topicDescription: null,
      userId: professor?.id
    };
    const variables = { input: values };
    submitSurvey({ variables });
  }

  return (
    <Grid display="flex" marginTop={4} justifyContent="center" padding={2} sx={{ width: '100%' }}>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={preferencesDialogOpen}
        onClose={() => {
          setPreferencesDialogOpen(false);
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Warning'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Proceeding will clear this user's preference survey responses for this year.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              clearPreferences();
              setPreferencesDialogOpen(false);
            }}
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
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
                {cookie.get('user').role === Role.Admin ? (
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    sx={{ marginTop: '1rem' }}
                    onClick={() => setPreferencesDialogOpen(true)}
                  >
                    Clear Preferences
                  </Button>
                ) : null}
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
                {professor && professor?.preferences && professor?.preferences?.length > 0 ? (
                  <Grid item width={'100%'}>
                    <DataGrid
                      getRowId={(row) => {
                        return row.id.subject + row.id.code + row.id.term + row.id.year;
                      }}
                      loading={userLoading}
                      autoHeight
                      rows={professor?.preferences.filter((preference: CoursePreference) => {
                        const a = preference;
                        return a.preference > 0;
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
                  </Grid>
                ) : (
                  <Typography variant="body1">No preferences recorded.</Typography>
                )}
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
                                secondary={course.CourseID.term + ' ' + course.CourseID.year}
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
