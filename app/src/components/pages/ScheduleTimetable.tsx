import React from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
import { Button, Box } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import 'components/styles/Scheduler.css';

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

  function exportState() {
    console.log(calendarCourseData);
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
