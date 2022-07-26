import React, { useContext, useEffect, useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
// import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import {
  checkCollision,
  firstMondayInMonth,
  getCourseStartDate,
  parseCalendarCourse,
  parseCalendarTeacher,
  sortByProf
} from 'utils/utils';
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
import { useMutation } from '@apollo/client';
import { UPDATE_SCHEDULE } from 'api/Mutations';
import { CourseSection, CourseSectionInput, CourseUpdateInput, Day, MeetingTime, Role } from 'types/api.types';
import 'components/styles/scheduler.css';

import { ScheduleControl } from 'components/organisms/ScheduleControl';
import {
  ICalendarCourseItem,
  ICalendarError,
  ICalendarItem_Teacher,
  IProfessorIndex,
  IProfessorIndexEntry
} from 'interfaces/timetable.interfaces';
import { AppointmentAddingEvent, AppointmentDeletingEvent, AppointmentUpdatingEvent } from 'devextreme/ui/scheduler';
import { TermSelectorContext } from 'contexts/TermSelectorContext';
import Cookie from 'universal-cookie';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
interface IStateProps {
  courseId?: string;
  professorId?: number;
}

function ScheduleTimetable() {
  const cookie = new Cookie();
  const location: Location = useLocation();
  const state: IStateProps = location.state as IStateProps;
  const courseId = state?.courseId ? state.courseId : undefined;
  const professorId = state?.professorId ? state.professorId : undefined;
  const { year, term, firstMondayOfTerm } = useContext(TermSelectorContext);

  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [currentDate, setCurrentDate] = useState<Date>(firstMondayOfTerm);

  const [calendarTeacherData, setCalendarTeacherData] = useState<ICalendarItem_Teacher[]>([]);
  const [calendarCourseData, setCalendarCourseData] = useState<ICalendarCourseItem[]>([]);

  const [errors, setErrors] = useState<ICalendarError[]>([]);
  const [profErrorIndex, setProfErrorIndex] = useState<IProfessorIndex>({});
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [updateSchedule, { updateData, updateLoading, updateError }] = useMutation(UPDATE_SCHEDULE);

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
    //loadingContext.setLoading(loading);
    if (updateData) {
      console.log(updateData);
    }
    if (updateError) {
      console.log(updateError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateData, updateLoading, updateError]);

  useEffect(() => {
    console.log('Calendar course data: ', calendarCourseData);
    console.log('Calendar teacher data: ', calendarTeacherData);
  }, [calendarCourseData, calendarTeacherData]);

  function onLoadingChange(loading: boolean) {
    setScheduleLoading(loading);
  }

  function validateAdd(appointment: AppointmentAddingEvent) {
    if (!checkPermissions()) {
      appointment.cancel = true;
    }
    return;
  }

  function validateDelete(appointment: AppointmentDeletingEvent) {
    if (!checkPermissions()) {
      appointment.cancel = true;
    }
    return;
  }

  function validateAppointment(appointment: AppointmentUpdatingEvent) {
    // Cancel update if not an admin user.
    if (!checkPermissions()) {
      appointment.cancel = true;
      return;
    }
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

  function exportState(id: String) {
    console.log(calendarTeacherData);
    console.log(calendarCourseData);

    console.log('errors');
    console.log(errors);

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

    if (Object.keys(profErrors).length === 0) {
      let grouped = {} as any;
      for (const course of calendarCourseData) {
        if (course.courseId in grouped) {
          if (course.section in grouped[course.courseId]) {
            const section = course.section;
            grouped[course.courseId][section].push(course);
          } else {
            const section = course.section;
            grouped[course.courseId][section] = [course];
          }
        } else {
          const section = course.section;
          const newObject = { [section]: [course] };
          grouped[course.courseId] = newObject;
        }
      }

      let courses: CourseSectionInput[] = [];
      for (const key in grouped) {
        const course_split = key.split(/(\d+)/);
        for (const section in grouped[key]) {
          const sectionMeetings = grouped[key][section];
          let meetingTimes = [];
          let professors: string[] = [];
          for (const meeting of sectionMeetings) {
            const weekday = [
              Day.Sunday,
              Day.Monday,
              Day.Tuesday,
              Day.Wednesday,
              Day.Thursday,
              Day.Friday,
              Day.Saturday
            ];
            const day = weekday[meeting.startDate.getDay()];
            const startTime =
              String(meeting.startDate.getHours()).padStart(2, '0') +
              String(meeting.startDate.getMinutes()).padEnd(2, '0') +
              '-01-01T00:00:00.000Z';
            const endTime =
              String(meeting.endDate.getHours()).padStart(2, '0') +
              String(meeting.endDate.getMinutes()).padEnd(2, '0') +
              '-01-01T00:00:00.000Z';
            const updatedTime: MeetingTime = {
              day: day,
              endTime: endTime,
              startTime: startTime
            };
            meetingTimes.push(updatedTime);
            for (const prof of meeting.professorsReference) {
              if (!professors.includes(prof.username)) professors.push(prof.username);
            }
          }
          const updateInput: CourseUpdateInput = {
            code: course_split[1],
            subject: course_split[0],
            term: sectionMeetings[0].term,
            title: sectionMeetings[0].title
          };
          const courseInput: CourseSectionInput = {
            capacity: sectionMeetings[0].capacity,
            endDate: new Date(sectionMeetings[0].endDateString),
            hoursPerWeek: 3,
            id: updateInput,
            meetingTimes: meetingTimes,
            professors: professors,
            sectionNumber: section,
            startDate: new Date(sectionMeetings[0].startDateString)
          };
          courses.push(courseInput);
        }
      }
      const values = {
        courses: courses,
        id: id,
        skipValidation: true,
        validation: 'COMPANY4'
      };
      const variables = { input: values };
      updateSchedule({ variables });
    }
    setDialogOpen(true);
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
    form.option('readOnly', !checkPermissions());
  }

  function checkPermissions() {
    return (cookie.get('user').role as Role) === Role.Admin;
  }

  useEffect(() => {
    if (!!year && !!term) {
      setCurrentDate(getCourseStartDate(year.getFullYear(), term));
      console.log('Current date set to: ', currentDate);
    }
  }, [year, term]);

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
              : "Your re-generation request was submitted successfully. When the scheduling algorithm checks complete, you'll be able to view the updated schedule here."}
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
        currentDate={currentDate}
        startDayHour={8}
        endDayHour={22}
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
        <Editing allowAdding={false} allowDeleting={false} allowResizing={false} allowDragging={checkPermissions()} />
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
