import React from 'react';
import { formatDate } from 'devextreme/localization';
import { ICalendarItem_Teacher } from 'components/shared/interfaces/timetable.interfaces';
import { Grid } from '@mui/material';
import { Container } from '@mui/system';
import { getTeacherById } from 'utils/utils';

/**
 * Present data in following format: coursename(subject & code) + teacher + time
 */
function Appointment(model: any) {
  const { targetedAppointmentData } = model.data;
  // console.log(targetedAppointmentData)
  const teacherInfo: ICalendarItem_Teacher = getTeacherById(targetedAppointmentData.teacherId) || {}; //link the teacher and course by teacherId

  return (
    <Container sx={{ height: '100%' }}>
      <Grid container className="showtime-preview" direction="column">
        <Grid item> {targetedAppointmentData.courseId} </Grid>
        <Grid item> {teacherInfo.teacherName} </Grid>
        <Grid item>
          {formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
          {' - '}
          {formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Appointment;
