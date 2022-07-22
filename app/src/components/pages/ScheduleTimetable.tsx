import React, { useEffect, useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import { checkCollision, parseCalendarCourse, parseCalendarTeacher, sortByProf } from 'utils/utils';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
  Button
} from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { CourseSection, Term } from 'types/api.types';
import 'components/styles/scheduler.css';

import { ScheduleControl } from 'components/organisms/ScheduleControl';
import {
  ICalendarCourseItem,
  ICalendarError,
  ICalendarItem_Teacher,
  IProfessorIndex,
  IProfessorIndexEntry
} from 'interfaces/timetable.interfaces';
import { AppointmentUpdatingEvent } from 'devextreme/ui/scheduler';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
interface IStateProps {
  courseId?: string;
  professorId?: number;
  year?: Date;
  term?: Term;
}

function ScheduleTimetable() {
  const location: Location = useLocation();
  const state: IStateProps = location.state as IStateProps;
  const courseId = state?.courseId ? state.courseId : undefined;
  const professorId = state?.professorId ? state.professorId : undefined;
  const year = state?.year ?? undefined;
  const term = state?.term ?? undefined;

  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2022, 8, 5)); // TODO: SET THIS TO THE FIRST WEEK OF THE SELECTED SEMESTER / YEAR

  const [calendarTeacherData, setCalendarTeacherData] = useState<ICalendarItem_Teacher[]>([]);
  const [calendarCourseData, setCalendarCourseData] = useState<ICalendarCourseItem[]>([]);

  const [errors, setErrors] = useState<ICalendarError[]>([]);
  const [profErrorIndex, setProfErrorIndex] = useState<IProfessorIndex>({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [containerHeight, setContainerHeight] = useState<number>(() => {
    return courseId || professorId ? window.innerHeight - 256 : window.innerHeight - 224;
  });

  window.onresize = function () {
    setContainerHeight(courseId || professorId ? window.innerHeight - 256 : window.innerHeight - 224);
  };

  function onCourseDataChange(courseData: CourseSection[]) {
    console.log('Course data changed!: ', courseData);
    setCalendarCourseData(parseCalendarCourse(courseData, courseId, professorId));
    setCalendarTeacherData(parseCalendarTeacher(courseData));
  }

  useEffect(() => {
    console.log('Calendar course data: ', calendarCourseData);
    console.log('Calendar teacher data: ', calendarTeacherData);
  }, [calendarCourseData, calendarTeacherData]);

  function onLoadingChange(loading: boolean) {
    setScheduleLoading(loading);
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
      console.log('Prof: ', prof);
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

  useEffect(() => {
    console.log('ERRORS WITH TIMETABLE: ', errors);
  }, [errors]);

  function onAppointmentFormOpening(e: any) {
    const form = e.form;
    form.option('items', [
      {
        label: { text: 'Course Name' },
        editorType: 'dxTextBox',
        dataField: 'courseId'
      },
      {
        label: { text: 'Professor' },
        editorType: 'dxTagBox',
        dataField: 'teacherId',
        editorOptions: { items: calendarTeacherData, displayExpr: 'teacherName', valueExpr: 'id' }
      },
      {
        label: { text: 'Course Start Time' },
        dataField: 'startDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'time'
        }
      },
      {
        label: { text: 'Course End Time' },
        dataField: 'endDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'time'
        }
      },
      {
        label: { text: 'Course Start Date' },
        dataField: 'startDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'date'
        }
      },
      {
        label: { text: 'Course End Date' },
        dataField: 'lastDay',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'date'
        }
      }
    ]);
  }

  function getStartingDate(year: Date, term: Term) {
    console.log('Getting starting date of month...');
  }

  function onDateChange(year?: Date, term?: Term) {
    if (year && term) {
      console.log('Date updated: ' + year.getFullYear() + ' ' + term);
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
                              {course.meetingTime.day +
                                ' ' +
                                course.meetingTime.startTime.split('T')[0] +
                                '-' +
                                course.meetingTime.endTime.split('T')[0]}
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
        <Grid container display={'flex'} flexDirection={'column'} paddingLeft={'15px'}>
          <ScheduleControl
            courseDataChanged={onCourseDataChange}
            filter
            save
            loadingCallback={onLoadingChange}
            exportState={exportState}
            onDateChange={onDateChange}
            year={year}
            term={term}
          />
          <Grid item marginBottom={'10px'}>
            {professorId && <Chip color="primary" label={'Filtered by Professor ID: ' + professorId} />}
            {courseId && <Chip color="primary" label={'Filtered by Course: ' + courseId} />}
          </Grid>
        </Grid>
      </Box>

      {/*@ts-ignore*/}
      <Scheduler
        timeZone="Canada/Pacific"
        dataSource={calendarCourseData}
        textExpr="courseId"
        views={[
          {
            type: 'week',
            name: 'Week',
            maxAppointmentsPerCell: 1
          }
        ]}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        startDayHour={8}
        endDayHour={20}
        onContentReady={() => {
          console.log('content ready');
        }}
        onInitialized={() => {
          console.log('initialized');
        }}
        onAppointmentAdded={() => {
          console.log('appointment added');
        }}
        height={containerHeight}
        width={'100%'}
        appointmentComponent={Appointment}
        showAllDayPanel={false}
        onAppointmentFormOpening={onAppointmentFormOpening}
        onAppointmentUpdating={(e) => validateAppointment(e)}
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
