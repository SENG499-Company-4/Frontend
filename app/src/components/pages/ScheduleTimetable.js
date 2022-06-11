import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from './appointment.js';
import { transferdata } from './appointment.js';
import { classData } from '../../data/data.js';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);
const views = ['day', 'week', 'month'];

function ScheduleTimetable() {
  return (
    <Scheduler
      timeZone="Canada/Victoria"
      dataSource={transferdata(classData)}
      views={views}
      defaultCurrentView="day"
      defaultCurrentDate={currentDate}
      startDayHour={8}
      height={800}
      appointmentComponent={Appointment}
      showAllDayPanel={false}
    >
      <Resource dataSource={transferdata(classData)} fieldExpr="course" useColorAsDefault={true} />
    </Scheduler>
  );
}

export default ScheduleTimetable;
