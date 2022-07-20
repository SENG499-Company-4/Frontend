import React, { useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { compareTime, parseCalendarCourse, parseCalendarTeacher, sortByProf } from 'utils/utils';
// import { ICourse } from 'interfaces/timetable.interfaces';
// import { useLocation } from 'react-router-dom';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { AppointmentUpdatingEvent } from 'devextreme/ui/scheduler';
import { common } from '@mui/material/colors';
import { ICalendarError, IProfessorIndex } from 'interfaces/timetable.interfaces';

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

  const [errors, setErrors] = useState<ICalendarError[]>([]);
  const [valid, setValid] = useState<boolean>(true);
  const [profIndex, setProfIndex] = useState<IProfessorIndex>(sortByProf(JSON.parse(JSON.stringify(classData))));

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  let calendarCourseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData)), courseId, professorId);
  let calendarTeacherData = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));

  const dayConvert = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
  };


  function exportState() {
    console.log(calendarTeacherData)
    console.log(calendarCourseData);

    console.log("errors")
    console.log(errors);


    return (
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{errors.length > 0 ? 'Errors persist' : 'Submission Successful'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {
              errors.length > 0
                ? errors.map((error) => {
                  return (

                    <Typography>{error.courseId + ": " + error.message}</Typography>
                  )
                })

                : 'Your generation request was submitted successfully. When the scheduling algorithm completes, you\'ll be able to view the schedule on the management page.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              window.location.reload();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    )


  }

  function validateAppointment(appointment: AppointmentUpdatingEvent) {

    console.log('updating', appointment);
    console.log(appointment.newData.startDate.getHours());

    const toAdd = appointment.newData

    const day: number = toAdd.startDate.getDay();

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
        professorId: toAdd.teacherId
      }]);
    } else {
      console.log("removing" + courseId + " from errors");
      setErrors(errors.filter(x => x.courseId !== courseId));
    }

    const profClasses = profIndex[toAdd.teacherId];
    let errorFound = false;

    // everytime we add a class, we check if it conflicts 
    // with another class the associated professor teaches

    console.log("looking at toAdd", toAdd);

    profClasses.classes.forEach(course => {


      if (errorFound || course.CourseID.subject + course.CourseID.code !== "CSC349A") {
        console.log("skipping")
        return;
      }

      console.log("looking at course", course);

      console.log("toAdd start is " + toAdd.startDate + " and end is  " + toAdd.endDate);


      console.log("day is " + day);
      course.meetingTimes.forEach(meetingTime => {
        console.log("looking at meetingTime", meetingTime);
        if (meetingTime.Day === dayConvert[day as keyof typeof dayConvert]) {

          const courseStart = new Date(toAdd.startDate);
          const courseEnd = new Date(toAdd.endDate);

          courseStart.setHours(parseInt(meetingTime.StartTime.split(":")[0]));
          courseStart.setMinutes(parseInt(meetingTime.StartTime.split(":")[1]));

          courseEnd.setHours(parseInt(meetingTime.EndTime.split(":")[0]));
          courseEnd.setMinutes(parseInt(meetingTime.EndTime.split(":")[1]));

          console.log("courseStart start is " + courseStart + " and end is  " + courseEnd);

          if (compareTime(toAdd.endDate, courseStart) > 0 && compareTime(toAdd.startDate, courseEnd) < 0) {
            errorFound = true;
            setValid(false);
            console.log("adding " + courseId + " to errors");
            setErrors([...errors, {
              courseId: toAdd.courseId,
              message: 'Classes overlap with assigned proffessor\'s other classes',
              startDate: toAdd.startDate,
              endDate: toAdd.endDate,
              professorId: toAdd.teacherId,
            }]);
          }
        }
      })

    });

    // if there were no errors, we remove the class from the errors array
    // (will happen whether it was in the array or not)
    if (!errorFound) {
      console.log("removing " + courseId + " from prof errors");
      setErrors(errors.filter(x => x.courseId !== courseId));
    }

    //if prof was changed we add it to the new prof's classes and remove it from the old prof's classes
    if (appointment.oldData.teacherId !== appointment.newData.teacherId) {


      setProfIndex((currentProfIndex) => {
        currentProfIndex[appointment.newData.teacherId].classes.push(appointment.newData);


        currentProfIndex[appointment.oldData.teacherId].classes = currentProfIndex[appointment.oldData.teacherId].classes.filter(x => x.CourseID !== courseId);

        return currentProfIndex;
      })
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
