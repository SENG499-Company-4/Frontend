import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from './appointment.js';
import {transferdata} from './appointment.js';
import { classData } from './data.js';



const currentDate = new Date(2021, 12, 10);
const views = ['day', 'week', 'month'];



function ScheduleTimetable() {
  return (
    // <Scheduler
    //   timeZone="America/Los_Angeles"
    //   dataSource={transferdata(source)}
    //   views={views}
    //   defaultCurrentView="timelineMonth"
    //   defaultCurrentDate={currentDate}
    //   height={580}


    //   firstDayOfWeek={0}
    //   startDayHour={8}>


    // </Scheduler>
    <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={transferdata(classData)}
    views={views}
    defaultCurrentView="month"
    defaultCurrentDate={currentDate}
    startDayHour={8}
    height={600}
    appointmentComponent={Appointment}
    showAllDayPanel={false}

    >
      <Resource
          dataSource={transferdata(classData)}
          fieldExpr="course"
          useColorAsDefault={true}
        />
  </Scheduler>


  );
}

export default ScheduleTimetable;
