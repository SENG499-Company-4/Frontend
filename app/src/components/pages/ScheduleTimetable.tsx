import React, { useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
import { Button, Box } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper, StyledInputBase } from 'components/styles/styles';
import { ICalendarCourseItem } from 'interfaces/timetable.interfaces';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

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
  const [filteredData, setFilteredData] = useState<any>(calendarCourseData);
  const [year, setYear] = useState<string>('0');

  const onYearChange = (event: SelectChangeEvent) => {
    setYear(event.target.value);

    if (event.target.value === '0') {
      setFilteredData(calendarCourseData);
    } else {
      var newData: ICalendarCourseItem[] = [];
      for (const course of calendarCourseData) {
        if (course?.courseId[3] === event.target.value) {
          newData.push(course);
        }
      }
      setFilteredData(newData);
    }
  };

  function exportState() {
    console.log(calendarCourseData);
  }

  function filter(data: ICalendarCourseItem[], search: string) {
    var newData: ICalendarCourseItem[] = [];
    var teacherId = 0;
    for (const teacher of calendarTeacherData) {
      if (teacher?.teacherName?.toLowerCase().includes(search.toLowerCase())) {
        teacherId = teacher?.id;
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
    setYear('0');
    setSearch(search);
    const newdata = filter(calendarCourseData, search);
    setFilteredData(newdata);
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" margin="5px">
        {!professorId && !courseId && (
          <Box display="flex">
            <FormControl sx={{ minWidth: '20ch', marginTop: 2 }} size="small">
              <InputLabel>Year</InputLabel>
              <Select id="year-select" value={year} label="Year" onChange={onYearChange}>
                <MenuItem value="0">All Year</MenuItem>
                <MenuItem value="1">Year 1</MenuItem>
                <MenuItem value="2">Year 2</MenuItem>
                <MenuItem value="3">Year 3</MenuItem>
                <MenuItem value="4">Year 4</MenuItem>
              </Select>
            </FormControl>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search by courseId/username FROM ALL YEAR"
                inputProps={{ 'aria-label': 'search' }}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              ></StyledInputBase>
            </Search>
          </Box>
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

        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={exportState}
          sx={{ marginTop: 1, marginBottom: 1 }}
        >
          Save Schedule
        </Button>
      </Box>

      {/*@ts-ignore*/}
      <Scheduler
        timeZone="Canada/Pacific"
        dataSource={year || search ? filteredData : calendarCourseData}
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
