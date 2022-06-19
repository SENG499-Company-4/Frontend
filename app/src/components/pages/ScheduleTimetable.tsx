import React from 'react';
import { Scheduler, Editing } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarJSON_Course, parseCalendarJSON_Teacher } from 'utils/utils';
import { Resource } from 'devextreme-react/scheduler';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);

function ScheduleTimetable() {
  const calendarData_Course = parseCalendarJSON_Course(JSON.parse(JSON.stringify(classData)));
  const calendarData_Teacher = parseCalendarJSON_Teacher(JSON.parse(JSON.stringify(classData)));

  return (
    <>
      {/*@ts-ignore*/}
      <Scheduler
        timeZone="Canada/Pacific"
        dataSource={calendarData_Course}
        defaultCurrentView="day"
        defaultCurrentDate={currentDate}
        startDayHour={8}
        height={800}
        appointmentComponent={Appointment}
        showAllDayPanel={false}
      >
        <Editing
          allowAdding={false}
          allowDragging={false}
        />
        <Resource
          dataSource={calendarData_Teacher}
          fieldExpr="teacherId"
          displayExpr='teacherName'
          label='Teacher'
          allowMultiple={true}
          useColorAsDefault={true}
        />
      </Scheduler>

    </>
  );
}

export default ScheduleTimetable;
