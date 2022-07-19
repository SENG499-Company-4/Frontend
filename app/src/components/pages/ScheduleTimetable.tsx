import React from 'react';
// import React, { useContext, useEffect, useState } from 'react';

import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
// import { ICourse } from 'interfaces/timetable.interfaces';
// import { useLocation } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { Form } from 'devextreme-react/data-grid';

// import { GET_COURSES } from 'api/Queries';
// import { useQuery } from '@apollo/client';

// import { LoadingContext } from 'contexts/LoadingContext';
// import { ErrorContext } from 'contexts/ErrorContext';


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

  let calendarCourseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData)), courseId, professorId);
  let calendarTeacherData = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));


  // const loadingContext = useContext(LoadingContext);
  // const errorContext = useContext(ErrorContext);
  // const [CoursesList, setCoursesList] = useState([]);

  // const {
  //   data: CoursesListData,
  //   loading: CoursesLoading,
  //   error: CoursesError
  // } = useQuery(GET_COURSES);

  // useEffect(() => {
  //   loadingContext.setLoading(CoursesLoading);
  //   if (CoursesListData) {
  //     setCoursesList(CoursesListData.courses)
  //   }
  //   if (CoursesError) {
  //     errorContext.setErrorDialog(CoursesError);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [CoursesListData, CoursesLoading, CoursesError]);

  // console.log("11111", CoursesListData);

  // let calendarCourseData = parseCalendarCourse(CoursesList, courseId, professorId);

  function exportState() {
    console.log(calendarCourseData);
  }

  function onAppointmentFormOpening(e: any) {
    const form = e.form;
    // let mainGroupItems = form.itemOption('mainGroup').items;
    // if (!mainGroupItems.find(function (i: any) { return i.dataField === "lastCourseStart" })) {
    //   mainGroupItems.push({
    //     colSpan: 2,
    //     label: { text: "Last Day of Course" },
    //     editorType: "dxDateBox",
    //     dataField: "lastCourseStart",
    //     editorOptions: {
    //       width: '100%',
    //       type: 'datetime',
    //       onValueChanged(args) {
    //         startDate = args.value;
    //         form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration));
    //       },
    //     },
    //   });

    //   mainGroupItems.splice(4, 1);
    //   form.itemOption('mainGroup', 'items', mainGroupItems);
    // }
    // console.log("GroupItems", mainGroupItems);


    // form.option('items', [{
    //   label: {
    //     text: 'Course Name',
    //   },
    //   editorType: 'dxTextBox',
    //   dataField: 'courseId',
    // }, {
    //   label: {
    //     text: 'Professor',
    //   },
    //   editorType: 'dxSelectBox',
    //   dataField: 'teacherId'
    // }, {
    //   dataField: 'startDate',
    //   editorType: 'dxDateBox',
    //   editorOptions: {
    //     width: '100%',
    //     type: 'datetime',
    //   },
    // }, {
    //   name: 'endDate',
    //   dataField: 'endDate',
    //   editorType: 'dxDateBox',
    //   editorOptions: {
    //     width: '100%',
    //     type: 'datetime',
    //   },
    // }
    // ]);

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
            maxAppointmentsPerCell: 1
          }
        ]}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        startDayHour={8}
        height={800}
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
