import React, { useEffect, useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
import { Box, Grid } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { CourseSection } from 'types/api.types';

import { ScheduleControl } from 'components/organisms/ScheduleControl';
import { ICalendarCourseItem, ICalendarItem_Teacher } from 'interfaces/timetable.interfaces';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date();

interface IStateProps {
  courseId?: string;
  professorId?: number;
}

function ScheduleTimetable() {
  const location: Location = useLocation();
  const state: IStateProps = location.state as IStateProps;
  const courseId = state?.courseId ? state.courseId : undefined;
  const professorId = state?.professorId ? state.professorId : undefined;

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

  return (
    <>
      <Box display="flex" justifyContent="space-between" margin="5px">
        <Grid container display={'flex'} flexDirection={'column'} paddingLeft={'15px'}>
          <ScheduleControl courseDataChanged={onCourseDataChange} filter save />
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
        editingAppointment={false}
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
