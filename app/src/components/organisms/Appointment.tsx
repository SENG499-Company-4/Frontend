import React, { useEffect } from 'react';
import { formatDate } from 'devextreme/localization';
import { Grid, Skeleton, Typography } from '@mui/material';
import { Container } from '@mui/system';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

/**
 * Present data in following format: coursename(subject & code) + teacher + time
 */
function Appointment(model: any) {
  const { targetedAppointmentData } = model.data;
  const GET_USER_BY_ID_LEAN = gql`
    query FindUserById($findUserByIdId: Int!) {
      findUserById(id: $findUserByIdId) {
        username
        id
        name
      }
    }
  `;

  const {
    data: getUserData,
    loading: getUserLoading,
    error: getUserError
  } = useQuery(GET_USER_BY_ID_LEAN, {
    variables: {
      findUserByIdId: parseInt(targetedAppointmentData.teacherId)
    }
  });

  useEffect(() => {
    if (getUserError) {
      console.log('Error getting user: ', getUserError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserError]);

  return (
    <Container
      sx={{ height: '100%' }}
      id={'appointment-' + targetedAppointmentData.courseId + '-' + targetedAppointmentData.section}
    >
      <Grid container className="showtime-preview" direction="column">
        {getUserLoading ? (
          <>
            <Skeleton variant="text" width={'100%'} sx={{ marginTop: '5px' }} />
            <Skeleton variant="text" width={'100%'} height={'100%'} />
          </>
        ) : (
          <>
            <Grid item>
              <Typography variant="body1">
                <strong>{targetedAppointmentData.courseId}</strong>
              </Typography>
            </Grid>
            <Grid item>{getUserData.findUserById.name}</Grid>
            <Grid item>
              {formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
              {' - '}
              {formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}

export default Appointment;
