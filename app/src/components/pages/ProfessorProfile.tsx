import { BubbleChart, Code, DeveloperBoard } from '@mui/icons-material';
import { Avatar, ButtonBase, Card, Grid, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { Role } from 'components/shared/constants/timetable.constants';
import { ICourse, IProfessor, IProfessorPreference } from 'components/shared/interfaces/timetable.interfaces';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCoursesForProfessor } from 'utils/utils';
import classData from 'data/clean.json';
import { useQuery } from '@apollo/client';
import { GET_USER } from 'components/shared/api/Queries';

function ProfessorProfile() {
  const navigate = useNavigate();

  const { id } = useParams();
  console.log('Visiting profile of ' + id);

  // TBD: When backend completes the User object, grab user by ID and populate the page with data from API.
  // Currently this code does nothing because it returns undefined.
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      id: id
    }
  });

  console.log(data, loading, error);

  const professor: IProfessor = {
    active: true,
    id: 123,
    role: Role.User,
    username: 'hausi',
    preferences: [
      { id: { subject: 'SENG', code: '265', term: 'SPRING' }, preference: 172 },
      { id: { subject: 'SENG', code: '480D', term: 'SPRING' }, preference: 150 },
      { id: { subject: 'SENG', code: '265', term: 'SUMMER' }, preference: 133 }
    ],
    faculty: 'SENG'
  };

  const currentlyTeaching: ICourse[] = getCoursesForProfessor(
    professor.username,
    JSON.parse(JSON.stringify(classData))
  );

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
      <Card elevation={10} sx={{ width: '70%' }}>
        <Grid display={'flex'} flexDirection={'row'} margin={4}>
          <Grid item mr={2}>
            <Avatar sx={{ bgcolor: '#3f80b5' }} />
          </Grid>
          <Grid item>
            <Typography variant="h4">
              <b>{professor.username}</b>
            </Typography>
          </Grid>
        </Grid>
        <Grid display={'flex'} flexDirection={'row'} margin={4}>
          <Grid item>
            <Typography variant="body1" color={professor.active ? 'green' : 'red'}>
              <b>{professor.active ? 'Active' : 'Inactive'}</b>
            </Typography>
            <Typography variant="body1">
              <b>Username: </b> {professor.username}
            </Typography>
            <Typography variant="body1">
              <b>Faculty: </b> {professor.faculty}
            </Typography>
            <Typography variant="body1">
              <b>Role: </b> {professor.role}
            </Typography>
          </Grid>
        </Grid>
        <Grid display={'flex'} flexDirection={'column'} margin={4}>
          <Grid item>
            <Typography variant="h5" marginBottom={2}>
              <b>Preferences</b>
            </Typography>
          </Grid>
          {professor.preferences.length > 0 ? (
            professor.preferences?.map((preference: IProfessorPreference) => (
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
                          <Avatar sx={{ bgcolor: facultyColors[course.CourseID.subject] }}>
                            {facultyIcons[course.CourseID.subject]}
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
      </Card>
    </Grid>
  );
}

export default ProfessorProfile;
