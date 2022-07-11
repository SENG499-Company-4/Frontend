import { BubbleChart, Code, DeveloperBoard } from '@mui/icons-material';
import {
  Avatar,
  ButtonBase,
  Card,
  CircularProgress,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import { Faculty } from 'constants/timetable.constants';
import { ICourse, IProfessorPreference } from 'interfaces/timetable.interfaces';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCoursesForProfessor } from 'utils/utils';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from 'api/Queries';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { CoursePreference, User } from 'types/api.types';

function ProfessorProfile() {
  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  const [professor, setProfessor] = useState<User>();
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

  useEffect(() => {
    loadingContext.setLoading(userLoading);
    if (userData) {
      console.log('User data: ', userData);
      setProfessor(userData.findUserById);
      // setUserData(userData.findUserById);
    }
    if (userError) {
      errorContext.setErrorDialog(userError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, userError, userLoading]);

  // TODO: Could implement this later when we get courses
  const currentlyTeaching: ICourse[] = getCoursesForProfessor(professor?.id);

  const facultyIcons = {
    SENG: <Code />,
    CSC: <BubbleChart />,
    ECE: <DeveloperBoard />
  };

  // Dictionary to store background color given faculty
  const facultyColors = {
    SENG: '#ffc107',
    CSC: '#4caf50',
    ECE: '#2196f3'
  };

  function getWilling(willingness: number) {
    if (willingness < 120) {
      return 'Not willing to teach';
    }
    if (willingness < 150) {
      return 'Somewhat willing to teach';
    }
    if (willingness < 170) {
      return 'Willing to teach';
    }
    if (willingness < 200) {
      return 'Very willing to teach';
    }
  }

  return (
    <Grid display="flex" marginTop={4} justifyContent="center" sx={{ width: '100%' }}>
      <Card elevation={10} sx={{ width: '70%', minHeight: '400px' }}>
        {userLoading ? (
          <Grid display={'flex'} justifyContent={'center'} alignContent={'center'}>
            <CircularProgress />
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
            <Grid display={'flex'} flexDirection={'row'} margin={4}>
              <Grid item>
                <Typography variant="body1" color={professor?.active ? 'green' : 'red'}>
                  <b>{professor?.active ? 'Active' : 'Inactive'}</b>
                </Typography>
                <Typography variant="body1">
                  <b>Username: </b> {professor?.username}
                </Typography>
                {/* 
            TODO: Implement this later when backend returns it
            <Typography variant="body1">
              <b>Faculty: </b> {professor?.faculty}
            </Typography> */}
                <Typography variant="body1">
                  <b>Role: </b> {professor?.role}
                </Typography>
              </Grid>
            </Grid>
            <Grid display={'flex'} flexDirection={'column'} margin={4}>
              <Grid item>
                <Typography variant="h5" marginBottom={2}>
                  <b>Preferences</b>
                </Typography>
              </Grid>
              {professor && professor?.preferences && professor?.preferences?.length > 0 ? (
                professor.preferences?.map((preference: CoursePreference) => (
                  <Grid item>
                    <Typography variant="body1">
                      <b>{preference.id.subject + ' ' + preference.id.code}</b>: {getWilling(preference.preference)}
                    </Typography>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1">No preferences recorded.</Typography>
              )}
            </Grid>
            <Grid display={'flex'} flexDirection={'column'} margin={4}>
              <Grid item>
                <Typography variant="h5">
                  <b>Currently Teaching</b>
                </Typography>
              </Grid>
              {currentlyTeaching.length > 0 ? (
                <Grid container spacing={2}>
                  {currentlyTeaching.map((course: ICourse) => (
                    <Grid item marginY={1}>
                      <ButtonBase
                        onClick={() => {
                          navigate('/schedule/timetable', {
                            state: {
                              courseId: course.CourseID.subject + course.CourseID.code
                            }
                          });
                        }}
                        sx={{ display: 'block', textAlign: 'initial' }}
                      >
                        <Card elevation={3} sx={{ width: '300px' }}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: facultyColors[course.CourseID.subject as Faculty] }}>
                                {facultyIcons[course.CourseID.subject as Faculty]}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={course.CourseID.subject + ' ' + course.CourseID.code}
                              secondary={course.startDate + ' - ' + course.endDate}
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
          </>
        )}
      </Card>
    </Grid>
  );
}

export default ProfessorProfile;
