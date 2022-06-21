import React from 'react';
import Query from 'devextreme/data/query';
import { formatDate } from 'devextreme/localization';
import classData from 'data/clean.json';
import { ICalendarItem } from 'components/shared/interfaces/timetable.interfaces';
import { Grid } from '@mui/material';
import { parseCalendarJSON } from 'utils/utils';
import { Container } from '@mui/system';

const data: ICalendarItem[] = parseCalendarJSON(JSON.parse(JSON.stringify(classData)));

/**
 * Filter newdata by course id
 */

export function getClassById(id: string) {
  return Query(data).filter(['courseId', id]).toArray()[0];
}

/**
 * Present data in following format: coursename(subject & code) + teacher + time
 */
function Appointment(model: any) {
  const { targetedAppointmentData } = model.data;
  const classInfo: ICalendarItem = getClassById(targetedAppointmentData.courseId) || {};

  return (
    <Container sx={{ height: '100%' }}>
      <Grid container className="showtime-preview" direction="column">
        <Grid item> {classInfo.text} </Grid>
        <Grid item> {classInfo.teacherName} </Grid>
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
