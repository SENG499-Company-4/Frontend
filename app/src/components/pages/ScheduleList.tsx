import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { GET_SCHEDULE } from 'api/Queries';
import { Box, Button, Chip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from 'contexts/LoadingContext';
import { Day, MeetingTime, Schedule, Term, User } from 'types/api.types';
import { ErrorContext } from 'contexts/ErrorContext';
import { SemesterSelector } from 'components/molecules/SemesterSelector';
import { useLazyQuery } from '@apollo/client';

interface ITableRow {
  courseName: string;
  capacity: number;
  professors: User[];
  startDate: string;
  endDate: string;
  meetingTimes: MeetingTime[];
}

function ScheduleList() {
  const [schedule, setSchedule] = useState<Schedule>();
  const [scheduleLoaded, setScheduleLoaded] = useState<boolean>(false);
  const [rows, setRows] = useState<ITableRow[]>([]);
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);
  const navigate = useNavigate();

  const [term, setTerm] = useState<Term | null>(null);
  const [year, setYear] = useState<Date | null>(null);

  useEffect(() => {
    if (term && year) {
      fetchSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, term]);

  const [fetchSchedule, { loading: scheduleLoading, error: scheduleError, data: scheduleData }] = useLazyQuery(
    GET_SCHEDULE,
    {
      variables: {
        year: year?.getFullYear(),
        term: term
      }
    }
  );

  useEffect(() => {
    loadingContext.setLoading(scheduleLoading);
    if (scheduleData) {
      console.log('Got information from GQL: ', scheduleData);
      setSchedule(scheduleData.schedule);
      setScheduleLoaded(true);
    }
    if (scheduleError) {
      errorContext.setErrorDialog(scheduleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleLoading, scheduleData, scheduleError]);

  useEffect(() => {
    if (scheduleLoaded && schedule?.courses) {
      const tableRows: ITableRow[] = [];
      for (const course of schedule.courses) {
        console.log('Parsing course: ', course);
        const row: ITableRow = {
          courseName: course.CourseID.subject + ' ' + course.CourseID.code,
          capacity: course.capacity,
          professors: course.professors ? course.professors : [],
          startDate: course.startDate,
          endDate: course.endDate,
          meetingTimes: course.meetingTimes
        };
        tableRows.push(row);
      }
      console.log('SETTING ROWS: ', tableRows);
      setRows(tableRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule, scheduleLoaded]);

  function parseDaysOfWeek(daysOfWeek: any): ReactNode {
    const daysAbbreviations = ['M', 'T', 'W', 'R', 'F'];

    const meetingDays = daysOfWeek.value.map((meetingTime: MeetingTime) => {
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

  const columns: GridColDef[] = [
    { field: 'courseName', headerName: 'Course Title', width: 130 },
    { field: 'startDate', headerName: 'Start Date', width: 140 },
    { field: 'endDate', headerName: 'End Date', width: 140 },
    { field: 'capacity', headerName: 'Capacity', width: 80 },
    {
      field: 'meetingTimes',
      headerName: 'Days of Week',
      width: 240,
      renderCell: (params) => {
        return parseDaysOfWeek(params);
      }
    },
    {
      field: 'professors',
      headerName: 'Professor',
      width: 180,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => {
              navigate('/professors/' + params.value[0].id);
            }}
          >
            {params.value[0].name}
          </Button>
        );
      }
    }
  ];

  return (
    <Box sx={{ width: '60%', margin: 'auto' }}>
      <Typography marginTop={5} marginBottom={2} variant="h4" sx={{ textAlign: 'center' }}>
        Schedule List
      </Typography>
      <Box style={{ marginBottom: '15px', marginTop: '30px' }}>
        <SemesterSelector
          year={undefined}
          term={undefined}
          onTermChange={(term: Term) => {
            console.log('TERM CHANGED: ', term);
            setTerm(term);
          }}
          onYearChange={(year: Date) => {
            console.log('YEAR CHANGED: ', year);
            setYear(year);
          }}
        />
      </Box>
      <DataGrid
        getRowId={(row: ITableRow) => {
          return row.courseName + row.capacity + row.startDate + row.endDate;
        }}
        loading={scheduleLoading}
        autoHeight
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
}

export default ScheduleList;
