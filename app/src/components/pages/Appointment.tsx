import React from 'react';
import Query from 'devextreme/data/query';
import { formatDate } from 'devextreme/localization';
import classData from 'data/clean.json';
import { CalendarItem, Course, Faculty } from 'interfaces/interfaces';
import { Grid } from '@mui/material';

/**
 * Grab data from python scraper and format it for DevExtreme Scheduler
 *  Reference: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/CustomTemplates/React/Light/
 */
export function parseCalendarJSON(data: Course[]): CalendarItem[] {
  return data.map((course: Course) => {
    const dayInit: string[] = [];
    course.meetingTimes.forEach((element) => {
      dayInit.push(element.Day.slice(0, 2));
    });
    const calendarItem: CalendarItem = {
      courseId: (course.CourseID.subject as Faculty) + course.CourseID.code,
      teacherId: course.professors[0].id, // TODO: Handle multiple professors
      text: (course.CourseID.subject as Faculty) + course.CourseID.code,
      startDate: new Date(course.startDate),
      endDate: new Date(course.endDate),
      teacherName: course.professors[0].username,
      recerrenceRule:
        'FREQ=WEEKLY;BYDAY=' + dayInit.join(',') + ';UNTIL=' + course.endDate.replaceAll('-', '') + 'T000000Z'
    };
    return calendarItem;
  });
}

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
  console.log('MODEL: ', model);
  const { targetedAppointmentData } = model.data;
  // console.log(targetedAppointmentData)
  const classData: CalendarItem = getClassById(targetedAppointmentData.courseId) || {};
  console.log('Class data: ', classData);

  return (
    <Grid container className="showtime-preview">
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
