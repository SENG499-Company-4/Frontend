import React from 'react';
import Query from 'devextreme/data/query';
import { formatDate } from 'devextreme/localization';
import classData from 'data/clean.json';
import { ICalendarItem_Teacher } from 'components/shared/interfaces/timetable.interfaces';
import { Grid } from '@mui/material';
import { parseCalendarJSON_Teacher } from 'utils/utils';
import { Container } from '@mui/system';

const data: ICalendarItem_Teacher[] = parseCalendarJSON_Teacher(JSON.parse(JSON.stringify(classData)));

function getTeacherById(id: number) {
  return Query(data).filter(['id', id]).toArray()[0];
}

/**
 * Present data in following format: coursename(subject & code) + teacher + time
 */
function Appointment(model: any) {
  const { targetedAppointmentData } = model.data;
  const teacherInfo: ICalendarItem_Teacher = getTeacherById(targetedAppointmentData.teacherId) || {}; //link the teacher and course by teacherId
  // console.log("classInfor", teacherInfo);

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
