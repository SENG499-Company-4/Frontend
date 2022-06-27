import React, { ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULE } from 'components/shared/api/Queries';
import { Box, Button, Chip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IScheduleListItem } from 'components/shared/interfaces/timetable.interfaces';
import classData from 'data/clean.json';
import { parseScheduleListItems } from 'utils/utils';
import { useNavigate } from 'react-router-dom';

function Schedule() {
  const allData: IScheduleListItem[] = parseScheduleListItems(JSON.parse(JSON.stringify(classData)));
  const [rows] = useState<IScheduleListItem[]>(allData);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_SCHEDULE, {
    variables: {
      year: 2022
    }
  });

  useEffect(() => {
    console.log('Got information from GQL: ', data);
  }, [loading, data, error]);

  function parseDaysOfWeek(daysOfWeek: string[]): ReactNode {
    const daysAbbreviations = ['M', 'T', 'W', 'R', 'F'];
    return daysAbbreviations.map((day, index) => {
      if (daysOfWeek.includes(day)) {
        return <Chip sx={{ marginX: '2px' }} color="primary" key={index} label={day} />;
      }
      return <Chip sx={{ marginX: '2px' }} key={index} label={day} />;
    });
  }

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Course Title', width: 130 },
    { field: 'startDate', headerName: 'Start Date', width: 140 },
    { field: 'endDate', headerName: 'End Date', width: 140 },
    { field: 'timeOfDay', headerName: 'Time of Day', width: 220 },
    {
      field: 'daysOffered',
      headerName: 'Days of Week',
      width: 240,
      renderCell: (params) => {
        return parseDaysOfWeek(params.value);
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
            {params.value[0].username}
          </Button>
        );
      }
    }
  ];

  return (
    <Box sx={{ width: '60%', margin: 'auto' }}>
      <Typography marginTop={5} marginBottom={2} variant="h4" sx={{ textAlign: 'center' }}>
        Current Schedule
      </Typography>
      <DataGrid
        getRowId={(row: IScheduleListItem) => {
          return row.professors[0].id + row.title + row.capacity + row.courseNumber;
        }}
        autoHeight
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
}

export default Schedule;
