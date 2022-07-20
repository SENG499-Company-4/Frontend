import React, { useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { checkCollision, parseCalendarCourse, parseCalendarTeacher, sortByProf } from 'utils/utils';
// import { ICourse } from 'interfaces/timetable.interfaces';
// import { useLocation } from 'react-router-dom';
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { AppointmentUpdatingEvent } from 'devextreme/ui/scheduler';
import { common } from '@mui/material/colors';
import { ICalendarError, IProfessorIndex, IProfessorIndexEntry } from 'interfaces/timetable.interfaces';

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
  const [profErrorIndex, setProfErrorIndex] = useState<IProfessorIndex>({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  let calendarCourseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData)), courseId, professorId);
  let calendarTeacherData = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));

  function exportState() {
    console.log(calendarTeacherData);
    console.log(calendarCourseData);

    console.log('errors');
    console.log(errors);
    setDialogOpen(true);

    const profIndex = sortByProf(calendarCourseData);
    const profErrors: IProfessorIndex = {};

    console.log('profIndex');
    console.log(profIndex);

    Object.keys(profIndex).map((key) => {
      const prof = profIndex[parseInt(key)];
      const added: number[] = [];

      prof.classes.forEach((course, index) => {
        prof.classes.forEach((course2, index2) => {
          if (index !== index2) {
            if (checkCollision(course.meetingTime, course2.meetingTime)) {
              if (!profErrors[prof.id]) {
                profErrors[prof.id] = {
                  id: prof.id,
                  username: prof.username,
                  classes: []
                };
              }
              //if course doesnt exist in profErrorIndex, add it
              if (!added.includes(index)) {
                profErrors[prof.id].classes.push(course);
                added.push(index);
              }

              if (!added.includes(index2)) {
                profErrors[prof.id].classes.push(course2);
                added.push(index2);
              }
            }
          }
        });
      });
    });

    setProfErrorIndex(profErrors);
    console.log('profErrors');
    console.log(profErrors);
  }

  function validateAppointment(appointment: AppointmentUpdatingEvent) {
    console.log('updating', appointment);
    console.log(appointment.newData.startDate.getHours());

    const toAdd = appointment.newData;

    const startHour = toAdd.startDate.getHours();
    const startMinute = toAdd.startDate.getMinutes();

    const endHour = toAdd.endDate.getHours();
    const endMinute = toAdd.endDate.getMinutes();

    const courseId = toAdd.courseId;

    console.log(courseId + ' start ' + startHour + ':' + startMinute + ' end ' + endHour + ':' + endMinute);

    // check if the time is valid and if it is, remove from the errors array
    // (will happen whether it was in the array or not)
    if ((startHour <= 8 && startMinute < 30) || (endHour >= 21 && endMinute > 0)) {
      console.log('adding ' + courseId + ' to errors');
      setErrors([
        ...errors,
        {
          courseId: courseId,
          capacity: toAdd.capacity,
          type: 'time',
          message: 'Classes must be between 8:30 AM and 9:00 PM',
          startDate: toAdd.startDate,
          endDate: toAdd.endDate,
          professorId: toAdd.teacherId
        }
      ]);
    } else {
      console.log('removing' + courseId + ' from errors');
      setErrors(errors.filter((x) => x.courseId !== courseId));
    }
  }

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{Object.keys(profErrorIndex).length > 0 ? 'Errors persist' : 'Submission Successful'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {Object.keys(profErrorIndex).length > 0
              ? Object.values(profErrorIndex).map((prof: IProfessorIndexEntry) => {
                return (
                  <>
                    <Typography>{prof.username + ' has course overlaps'}</Typography>
                    {prof.classes.map((course) => {
                      return (
                        <Typography>
                          {/* this line is and the one below is is purely for adding a new line for readability and it doesnt seem to process a "\n" */}
                          <Typography>{'-'}</Typography>
                          {course.courseId + ' Section ' + course.capacity}
                          <Typography>
                            {course.meetingTime.Day +
                              ' ' +
                              course.meetingTime.StartTime +
                              '-' +
                              course.meetingTime.EndTime}
                          </Typography>
                        </Typography>
                      );
                    })}
                  </>
                );
              })
              : "Your generation request was submitted successfully. When the scheduling algorithm completes, you'll be able to view the schedule on the management page."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
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
