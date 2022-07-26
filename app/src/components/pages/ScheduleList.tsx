import React, { ReactNode, useContext, useState } from 'react';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { CourseSection, Day, MeetingTime, Term, User } from 'types/api.types';
import { ScheduleControl } from 'components/organisms/ScheduleControl';
import { Role } from 'constants/timetable.constants';
import Cookie from 'universal-cookie';
import { TermSelectorContext } from 'contexts/TermSelectorContext';
import { garfield, getLastFriday, getTermMonthIndex } from 'utils/utils';
interface TableRow {
  courseName: string;
  capacity: number;
  professors: User[];
  startDate: Date;
  endDate: Date;
  meetingDays: MeetingTime[];
  meetingTimes: MeetingTime[];
  sectionNumber: string;
}

function ScheduleList() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const navigate = useNavigate();
  const cookie = new Cookie();
  const { year, term } = useContext(TermSelectorContext);

  function parseDaysOfWeek(daysOfWeek: MeetingTime[]): ReactNode {
    const daysAbbreviations = ['M', 'T', 'W', 'R', 'F'];
    const meetingDays = daysOfWeek.map((meetingTime: MeetingTime) => {
      if (meetingTime.day === Day.Thursday) {
        return 'R';
      } else {
        return meetingTime.day.toString().substring(0, 1);
      }
    });

    return daysAbbreviations.map((day, index) => {
      if (meetingDays.includes(day)) {
        return <Chip sx={{ marginX: '2px' }} color="primary" key={index} label={day} />;
      }
      return <Chip sx={{ marginX: '2px' }} key={index} label={day} />;
    });
  }

  function parseMeetingTimes(meetingTimes: MeetingTime[]): ReactNode {
    return meetingTimes.map((meetingTime: MeetingTime, index: number) => {
      let timeString = meetingTime.startTime.split('-')[0];
      const startTime = timeString.slice(0, -2) + ':' + timeString.slice(-2);
      timeString = meetingTime.endTime.split('-')[0];
      const endTime = timeString.slice(0, -2) + ':' + timeString.slice(-2);
      if (index === 0) {
        return <Chip sx={{ marginX: '2px' }} key={index} label={`${startTime} - ${endTime}`} />;
      } else {
        return <></>;
      }
    });
  }

  function editSchedule() {
    navigate('/schedule/timetable', {
      state: {
        year: year,
        term: term
      }
    });
  }

  function makeStartDateString(year: number, term: Term) {
    return (
      year +
      '-' +
      String(getTermMonthIndex(term) + 1).padStart(2, '0') +
      '-' +
      String(garfield(year, term)).padStart(2, '0')
    );
  }

  function makeEndDateString(year: number, term: Term) {
    return (
      year +
      '-' +
      String(getTermMonthIndex(term) + 4).padStart(2, '0') +
      '-' +
      String(getLastFriday(year, term)).padStart(2, '0')
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'courseName',
      headerName: 'Course Title',
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography variant="body1" ml={1}>
            {params.value}
          </Typography>
        );
      }
    },
    {
      field: 'sectionNumber',
      headerName: 'Section',
      flex: 1
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      renderCell: () => {
        return makeStartDateString(year.getFullYear(), term);
      }
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1,
      renderCell: () => {
        return makeEndDateString(year.getFullYear(), term);
      }
    },
    { field: 'capacity', headerName: 'Capacity', width: 80 },
    {
      field: 'meetingDays',
      headerName: 'Days of Week',
      flex: 2,
      renderCell: (params) => {
        return parseDaysOfWeek(params.value as MeetingTime[]);
      }
    },
    {
      field: 'meetingTimes',
      headerName: 'Meeting Time',
      flex: 1,
      renderCell: (params) => {
        return parseMeetingTimes(params.value as MeetingTime[]);
      }
    },
    {
      field: 'professors',
      headerName: 'Professor',
      flex: 2,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              navigate('/professors/' + params.value[0].id);
            }}
          >
            <Typography noWrap variant="inherit">
              {params.value[0].name}
            </Typography>
          </Button>
        );
      }
    }
  ];

  function onCourseDataChange(courseData: CourseSection[]) {
    console.log('Course data changed!: ', courseData);
    if (courseData) {
      const tableRows: TableRow[] = [];
      for (const course of courseData) {
        // Get number of course sections for course
        const courseId = course.CourseID.subject + course.CourseID.code;
        console.log('Course ID: ', courseId);
        let numSections = 0;
        for (const courseSection of courseData) {
          console.log('Checking against course ID: ', courseSection.CourseID.subject + courseSection.CourseID.code);
          if (courseSection.CourseID.subject + courseSection.CourseID.code === courseId) {
            console.log('Found matching course');
            numSections++;
          }
        }
        const row: TableRow = {
          courseName: course.CourseID.subject + ' ' + course.CourseID.code,
          capacity: Math.floor(course.capacity / (numSections === 0 ? 1 : numSections)),
          professors: course.professors ? course.professors : [],
          startDate: course.startDate,
          endDate: course.endDate,
          meetingDays: course.meetingTimes,
          meetingTimes: course.meetingTimes,
          sectionNumber: course.sectionNumber
        };
        console.log('Row: ', row);
        tableRows.push(row);
      }
      setRows(tableRows);
    }
  }

  function onLoadingChange(loading: boolean) {
    setScheduleLoading(loading);
  }

  return (
    <Box sx={{ width: '90%', maxWidth: 1200, margin: 'auto' }}>
      <Typography marginTop={5} marginBottom={2} variant="h4" sx={{ textAlign: 'center' }}>
        Schedule List
      </Typography>
      <Box display="flex" justifyContent="space-between" margin="5px">
        <Grid container display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <Grid item>
            <ScheduleControl courseDataChanged={onCourseDataChange} loadingCallback={onLoadingChange} filter />
          </Grid>
          {cookie.get('user').role === Role.Admin ? (
            <Grid item alignContent={'flex-end'}>
              <Button
                sx={{ height: '56px', marginTop: '62px', marginLeft: '10px' }}
                variant="contained"
                size="large"
                color="primary"
                onClick={editSchedule}
              >
                Edit Schedule
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Box>
      <DataGrid
        getRowId={(row: TableRow) => {
          return row.courseName + row.capacity + row.startDate + row.endDate + row.sectionNumber;
        }}
        components={{
          NoRowsOverlay: () => (
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
              <Typography variant="h6" mt={2}>
                <strong> No records match your search settings.</strong>
              </Typography>
              <Typography variant="body1" mb={2}>
                Try changing your search settings or the selected term.
              </Typography>
            </Box>
          )
        }}
        loading={scheduleLoading}
        disableSelectionOnClick
        autoHeight={true}
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
}

export default ScheduleList;
