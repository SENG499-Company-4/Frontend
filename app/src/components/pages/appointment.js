import React from 'react';
import Query from 'devextreme/data/query';
import { formatDate } from 'devextreme/localization';
import { classData } from './data.js';

//Reference: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/CustomTemplates/React/Light/

/**
 * Grab data and formate it for DevExtreme Scheduler
 */

export function transferdata(data) {
  var newdata = [];
  data.map(function (item) {
    var newitem = {};
    newitem.courseId = item.CourseID.code;
    newitem.teacherId = item.professors[0].id;
    newitem.text = item.CourseID.subject + item.CourseID.code;
    newitem.startDate = new Date(item.startDate + 'T' + item.meetingTimes[0].StartTime);
    newitem.teachername = item.professors[0].username;
    newitem.endDate = new Date(item.startDate + 'T' + item.meetingTimes[0].EndTime);
    var dayInit = [];
    item.meetingTimes.forEach((element) => {
      dayInit.push(element.Day.slice(0, 2));
    });

    newitem.recurrenceRule =
      'FREQ=WEEKLY;BYDAY=' + dayInit.join(',') + ';UNTIL=' + item.endDate.replaceAll('-', '') + 'T' + '000000Z';
    newdata.push(newitem);
  });
  // console.log(newdata);
  return newdata;
}

const newdata = transferdata(classData);

/**
 * Filter newdata by course id
 */

function getClassById(id) {
  return Query(newdata).filter(['courseId', id]).toArray()[0];
}

/**
 * Present data in following format: coursename(subject & code) + teacher + time
 */

export default function Appointment(model) {
  const { targetedAppointmentData } = model.data;
  // console.log(targetedAppointmentData)
  const Data = getClassById(targetedAppointmentData.courseId) || {};

  return (
    <div className="showtime-preview">
      <div> {Data.text} </div>
      <div> {Data.teachername} </div>
      <div>
        {formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
        {' - '}
        {formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
      </div>
    </div>
  );
}
