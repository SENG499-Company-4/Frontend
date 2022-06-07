import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import { data } from './coursedata';


const source = [
  {
    "CourseID": { "subject": "CSC", "code": "105", "term": "SPRING" },
    "hoursPerWeek": 3,
    "capacity": 150,
    "professors": [
      {
        "id": 3402,
        "username": "olgagould",
        "password": null,
        "role": "USER",
        "preferences": { "id": { "subject": "CSC", "code": "105", "term": "SPRING" }, "preference": 130 },
        "active": true
      }
    ],
    "startDate": "2022-01-10",
    "endDate": "2022-04-07",
    "meetingTimes": [
      { "Day": "TUESDAY", "StartTime": "08:30:00", "EndTime": "09:20:00" },
      { "Day": "WEDNESDAY", "StartTime": "08:30:00", "EndTime": "09:20:00" },
      { "Day": "FRIDAY", "StartTime": "08:30:00", "EndTime": "09:20:00" }
    ]
  },
  {
    "CourseID": { "subject": "CSC", "code": "106", "term": "SPRING" },
    "hoursPerWeek": 3,
    "capacity": 20,
    "professors": [
      {
        "id": 6925,
        "username": "nacenta",
        "password": null,
        "role": "USER",
        "preferences": { "id": { "subject": "CSC", "code": "106", "term": "SPRING" }, "preference": 194 },
        "active": true
      }
    ],
    "startDate": "2022-01-10",
    "endDate": "2022-04-07",
    "meetingTimes": [
      { "Day": "TUESDAY", "StartTime": "11:30:00", "EndTime": "12:20:00" },
      { "Day": "WEDNESDAY", "StartTime": "11:30:00", "EndTime": "12:20:00" },
      { "Day": "FRIDAY", "StartTime": "11:30:00", "EndTime": "12:20:00" }
    ]
  }];

const currentDate = new Date(2021, 12, 10);
const views = ['timelineWeek', 'timelineMonth'];


function transferdata(data) {
  var newdata = [];
  data.map(function (item) {
    var newitem = {};
    newitem.text = item.CourseID.subject + item.CourseID.code;
    newitem.startDate = new Date(item.startDate + 'T' + item.meetingTimes[0].StartTime);

    newitem.endDate = new Date(item.startDate + 'T' + item.meetingTimes[0].EndTime);
    newitem.recurrenceRule = 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10';

    newdata.push(newitem);
  })
  console.log(newdata);
  return newdata;
}


function ScheduleTimetable() {
  return (
    <Scheduler
      timeZone="America/Los_Angeles"
      dataSource={transferdata(source)}
      views={views}
      defaultCurrentView="timelineMonth"
      defaultCurrentDate={currentDate}
      height={580}


      firstDayOfWeek={0}
      startDayHour={8}>


    </Scheduler>
  );
}

export default ScheduleTimetable;
