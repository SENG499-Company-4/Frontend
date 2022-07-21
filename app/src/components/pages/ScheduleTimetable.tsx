import React, { useEffect, useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
import { Box, Grid } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { CourseSection } from 'types/api.types';
import 'components/styles/scheduler.css';

import { ScheduleControl } from 'components/organisms/ScheduleControl';
import { ICalendarCourseItem, ICalendarItem_Teacher } from 'interfaces/timetable.interfaces';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);

interface IStateProps {
  courseId?: string;
  professorId?: number;
}

function ScheduleTimetable() {
  const location: Location = useLocation();
  const state: IStateProps = location.state as IStateProps;
  const courseId = state?.courseId ? state.courseId : undefined;
  const professorId = state?.professorId ? state.professorId : undefined;
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [calendarTeacherData, setCalendarTeacherData] = useState<ICalendarItem_Teacher[]>([]);
  const [calendarCourseData, setCalendarCourseData] = useState<ICalendarCourseItem[]>([]);

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

  return (
    <>
      <Box display="flex" justifyContent="space-between" margin="5px">
        <Grid container display={'flex'} flexDirection={'column'} paddingLeft={'15px'}>
          <ScheduleControl courseDataChanged={onCourseDataChange} filter save loadingCallback={onLoadingChange} />
          <Grid item marginLeft={'20px'} marginBottom={'10px'}>
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
            type: 'day',
            name: 'Day',
            maxAppointmentsPerCell: 'auto'
          },
          {
            type: 'week',
            name: 'Week',
            maxAppointmentsPerCell: 1
          }
        ]}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        startDayHour={8}
        endDayHour={21}
        height={containerHeight}
        width={'100%'}
        appointmentComponent={Appointment}
        showAllDayPanel={false}
        onAppointmentFormOpening={onAppointmentFormOpening}
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
