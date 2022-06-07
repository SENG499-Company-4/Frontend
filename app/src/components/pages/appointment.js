import React from 'react';
import Query from 'devextreme/data/query';
import {formatDate} from 'devextreme/localization';
import { classData } from './data.js';

export function transferdata(data) {
    var newdata = [];
    data.map(function (item, index) {
      var newitem = {};
      newitem.courseId = item.CourseID.code;
      newitem.teacherId = item.professors[0].id;
      newitem.text = item.CourseID.subject + item.CourseID.code;
      newitem.startDate = new Date(item.startDate + 'T' + item.meetingTimes[0].StartTime);
      newitem.teachername = item.professors[0].username;
      newitem.endDate = new Date(item.startDate + 'T' + item.meetingTimes[0].EndTime);
      var dayInit = []; 
      item.meetingTimes.forEach(element => {
        dayInit.push(element.Day.slice(0,2));
      });
      
      newitem.recurrenceRule = 'FREQ=WEEKLY;BYDAY='+dayInit.join(',')+';UNTIL='+item.endDate.replaceAll("-","")+"T"+"000000Z";
  
      newdata.push(newitem);
    })
    console.log(newdata);
    return newdata;
}

const newdata = transferdata(classData)

function getClassById(id) {
  return Query(newdata).filter(['courseId', id]).toArray()[0];
}

export default function Appointment(model) {
  const { targetedAppointmentData } = model.data;
  console.log(targetedAppointmentData)
  const Data = getClassById(targetedAppointmentData.courseId) || {};

  return (
    <div className="showtime-preview">
      <div> {Data.text}</div>
      <div>
        {Data.teachername}
      </div>
      <div>
        {formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
        {' - '}
        {formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
      </div>
    </div>
  );
}
