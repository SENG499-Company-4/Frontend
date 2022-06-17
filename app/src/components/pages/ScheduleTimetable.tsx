import React from 'react';
import { Scheduler, Editing } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarJSON } from 'utils/utils';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);

function ScheduleTimetable() {
  const calendarData = parseCalendarJSON(JSON.parse(JSON.stringify(classData)));
  // const calendarData_2 = parseCalendarJSON_2(JSON.parse(JSON.stringify(classData)));

  return (
    <>
      {/*@ts-ignore*/}
      <Scheduler
        timeZone="Canada/Pacific"
        dataSource={calendarData}
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
        {/* <Resource
          dataSource={calendarData_2}
          fieldExpr="teacherId"
          useColorAsDefault={true}
        /> */}
      </Scheduler>

    </>
  );
}

export default ScheduleTimetable;
