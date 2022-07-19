import React, { useState } from 'react';
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

import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper, StyledInputBase } from 'components/styles/styles';
import { ICalendarCourseItem } from 'interfaces/timetable.interfaces'

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

  const [search, setSearch] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any>([]);
  function exportState() {
    console.log(calendarCourseData);
  }

  function filter(data: ICalendarCourseItem[], search: string) {
    var newData: ICalendarCourseItem[] = [];
    // console.log('DATA: ', data);
    console.log("teacher", calendarTeacherData)
    console.log("data", data)


    var teacherId = 0;
    for (const teacher of calendarTeacherData) {
      if (teacher?.teacherName?.toLowerCase().includes(search.toLowerCase())) {
        teacherId = teacher?.id
        for (const course of data) {
          if (course?.teacherId === teacherId) {
            newData.push(course);
          }
        }
        return newData;
      }
    }

    for (const course of data) {
      if (course?.courseId?.toLowerCase().includes(search.toLowerCase())) {
        newData.push(course);
      }
    }
    return newData;
  }

  function onSearchChange(search: string) {
    setSearch(search);
    const newdata = filter(calendarCourseData, search);
    setFilteredData(newdata);
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" margin="5px">

        {!professorId && !courseId && (
          <div>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search by courseId/username"
                inputProps={{ 'aria-label': 'search' }}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              ></StyledInputBase>
            </Search>
          </div>
        )}

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
        dataSource={search ? filteredData : calendarCourseData}
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
