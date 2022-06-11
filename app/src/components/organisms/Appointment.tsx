import React from 'react';
import Query from 'devextreme/data/query';
import { formatDate } from 'devextreme/localization';
import classData from 'data/clean.json';
import { CalendarItem } from 'interfaces/interfaces';
import { Grid } from '@mui/material';
import { parseCalendarJSON } from 'utils/utils';


const data: CalendarItem[] = parseCalendarJSON(JSON.parse(JSON.stringify(classData)));

/**
 * Filter newdata by course id
 */

function getClassById(id: string) {
  return Query(data).filter(['courseId', id]).toArray()[0];
}

/**
 * Present data in following format: coursename(subject & code) + teacher + time
 */
function Appointment(model: any) {
  // console.log('MODEL: ', model);
  const { targetedAppointmentData } = model.data;
  // console.log(targetedAppointmentData)
  const classData: CalendarItem = getClassById(targetedAppointmentData.courseId) || {};
  // console.log('Class data: ', classData);

  return (
    <Grid container className="showtime-preview" direction="column">
      <Grid item> {classData.text} </Grid>
      <Grid item> {classData.teacherName} </Grid>
      <Grid item>
        {formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
        {' - '}
        {formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
      </Grid>
    </Grid>
  );
}

export default Appointment;
