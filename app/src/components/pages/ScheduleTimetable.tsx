import React, { useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarCourse, parseCalendarTeacher, sortByProf } from 'utils/utils';
// import { ICourse } from 'interfaces/timetable.interfaces';
// import { useLocation } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { AppointmentUpdatingEvent } from 'devextreme/ui/scheduler';
import { common } from '@mui/material/colors';
import { IProfessorIndex } from 'interfaces/timetable.interfaces';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);

interface IStateProps {
  courseId?: string;
  professorId?: number;
}

function ScheduleTimetable() {
  const location: Location = useLocation();
  const state: IStateProps = location.state as IStateProps;
  console.log('Location: ', location);
  const courseId = state?.courseId ? state.courseId : undefined;
  const professorId = state?.professorId ? state.professorId : undefined;

  const [errors, setErrors] = useState<any[]>([]);
  const [valid, setValid] = useState<boolean>(true);
  const [profIndex, setProfIndex] = useState<IProfessorIndex>(sortByProf(JSON.parse(JSON.stringify(classData))));

  let calendarCourseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData)), courseId, professorId);
  let calendarTeacherData = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));

  function compareTime(a: Date, b: Date) {
    if (a.getHours() > b.getHours()) {
      return 1;
    } else if (a.getHours() < b.getHours()) {
      return -1;
    } else {
      //hours are equal
      if (a.getMinutes() > b.getMinutes()) {
        return 1;
      } else if (a.getMinutes() < b.getMinutes()) {
        return -1;
      } else {
        return 0;
      }
    }
  }


  function exportState() {
    console.log(calendarTeacherData)
    console.log(calendarCourseData);

    console.log("errors")
    console.log(errors);
  }
  function validateAppointment(appointment: AppointmentUpdatingEvent) {

    console.log('updating', appointment);
    console.log(appointment.newData.startDate.getHours());

    const toAdd = appointment.newData

    const day = toAdd.startDate.getDay();

    const startHour = toAdd.startDate.getHours();
    const startMinute = toAdd.startDate.getMinutes();

    const endHour = toAdd.endDate.getHours();
    const endMinute = toAdd.endDate.getMinutes();

    const courseId = toAdd.courseId;

    console.log(courseId + " start " + startHour + ":" + startMinute + " end " + endHour + ":" + endMinute);

    // check if the time is valid and if it is, remove from the errors array
    // (will happen whether it was in the array or not)
    if ((startHour <= 8 && startMinute < 30) || (endHour >= 21 && endMinute > 0)) {
      setValid(false);
      console.log("adding " + courseId + " to errors");
      setErrors([...errors, {
        courseId: courseId,
        message: 'Classes must be between 8:30 AM and 9:00 PM',
        startDate: toAdd.startDate,
        endDate: toAdd.endDate,
        professorId: toAdd.teacherId,
      }]);
    } else {
      console.log("removing" + courseId + " from errors");
      setErrors(errors.filter(x => x.courseId !== courseId));
    }

    const profClasses = profIndex[toAdd.teacherId];
    let errorFound = false;

    // everytime we add a class, we check if it conflicts 
    // with another class the associated professor teaches
    profClasses.classes.forEach(course => {
      if (errorFound || course.CourseID === courseId)
        return;

      const courseStart = new Date(course.startDate);
      const courseEnd = new Date(course.endDate);

      if (courseStart.getDay() === day) {
        if (compareTime(toAdd.endDate, courseStart) > 0 && compareTime(toAdd.startDate, courseEnd) < 0) {
          errorFound = true;
          setValid(false);
          console.log("adding " + courseId + " to errors");
          setErrors([...errors, {
            courseId: toAdd.courseId,
            message: 'Classes must not overlap',
            startDate: toAdd.startDate,
            endDate: toAdd.endDate,
            professorId: toAdd.teacherId,
          }]);
        }
      }

    });

    // if there were no errors, we remove the class from the errors array
    // (will happen whether it was in the array or not)
    if (!errorFound) {
      console.log("removing" + courseId + " from errors");
      setErrors(errors.filter(x => x.courseId !== courseId));
    }

  }


  return (
    <>
      <Box display="flex" justifyContent="space-between" margin="5px">
        <div>
          {professorId && (
            <Chip
              color="primary"
              label={'Filtered by Professor: ' + professorId}
              sx={{
                margin: '10px'
              }}
            />
          )}
          {courseId && (
            <Chip
              color="primary"
              label={'Filtered by Course: ' + courseId}
              sx={{
                margin: '10px'
              }}
            />
          )}
        </div>

        <Button variant="contained" size="large" color="secondary" onClick={exportState}>
          Save Schedule
        </Button>
      </Box>

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
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        startDayHour={8}
        height={800}
        appointmentComponent={Appointment}
        showAllDayPanel={false}
        editingAppointment={false}
        onAppointmentUpdating={(e) => validateAppointment(e)}
      // onAppointmentUpdated={(e) => { console.log('updated', e); }}
      >
        <Editing allowAdding={false} allowDragging={true} />
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
