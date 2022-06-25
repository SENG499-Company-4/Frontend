import React from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
import { parseCalendarJSON } from 'utils/utils';
import { useLocation } from 'react-router-dom';
import { ICourse } from 'components/shared/interfaces/timetable.interfaces';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);

interface IStateProps {
  course: ICourse;
}

function ScheduleTimetable() {
  const calendarCourseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData)));
  const calendarTeacherData = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));

  const { state } = useLocation();
  const { course } = state as IStateProps;
  console.log('Got course: ', course);

  const calendarData = parseCalendarJSON(JSON.parse(JSON.stringify(classData)));
  return (
    <>
      {/*@ts-ignore*/}
      <Scheduler
        timeZone="Canada/Pacific"
        dataSource={calendarCourseData}
        views={[
          {
            type: 'day',
            name: 'Day',
            maxAppointmentsPerCell: 'auto'
          },
          {
            type: 'week',
            name: 'Week',
            maxAppointmentsPerCell: 2
          }
        ]}
        defaultCurrentView="day"
        defaultCurrentDate={currentDate}
        startDayHour={8}
        height={800}
        appointmentComponent={Appointment}
        showAllDayPanel={false}
      >
        <Editing allowAdding={false} allowDragging={false} />
        <Resource
          dataSource={calendarTeacherData}
          fieldExpr="teacherId"
          displayExpr="teacherName"
          label="Professor"
          allowMultiple={true}
          useColorAsDefault={true}
        />
      </Scheduler>
    </>
  );
}

export default ScheduleTimetable;
