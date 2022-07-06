import React from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
// import { ICourse } from 'components/shared/interfaces/timetable.interfaces';
// import { useLocation } from 'react-router-dom';
import { Button, Box } from '@mui/material';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);

// interface IStateProps {
//   course: ICourse;
// }

function ScheduleTimetable() {
  const calendarCourseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData)));
  const calendarTeacherData = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));

  // const { state } = useLocation();
  // const { course } = state as IStateProps;

  function exportState() {
    console.log(calendarCourseData);
  }

  return (
    <>
      {/*@ts-ignore*/}
      <Scheduler
        timeZone="Canada/Pacific"
        dataSource={calendarCourseData}
        textExpr="courseId"
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
        editingAppointment={false}
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
      <Box display="flex" justifyContent="center" marginTop="10px">
        <Button variant="contained" size="large" onClick={exportState}>
          Save
        </Button>
      </Box>
    </>
  );
}

export default ScheduleTimetable;
