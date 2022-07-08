import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { parseCalendarTeacher } from 'utils/utils';
import classData from 'data/clean.json';
import { Box, ButtonBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper, StyledInputBase } from 'components/styles/styles';
import { useState } from 'react';
import { ICalendarItem_Teacher } from 'components/shared/interfaces/timetable.interfaces';
import Link from '@mui/material/Link';
import { NavigateFunction, useNavigate } from 'react-router-dom';

function ProfessorsList() {
  const allData: ICalendarItem_Teacher[] = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));
  const [search, setSearch] = useState<string>('');
  const [rows, setRows] = useState<ICalendarItem_Teacher[]>(allData);
  const navigate: NavigateFunction = useNavigate();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'teacherName', headerName: 'Username', width: 130 },
    { field: 'faculty', headerName: 'Faculty', width: 100 },
    {
      field: 'link',
      headerName: 'View Professor Profile',
      width: 200,
      renderCell: (params) => <Link href={params.value}> View profile </Link>
    },
    {
      field: 'courses',
      headerName: 'Currently Teaching',
      width: 300,
      renderCell: (params) => {
        console.log('params', params);
        return (
          <ButtonBase
            onClick={() => {
              navigate('/schedule/timetable', {
                state: {
                  professorId: params.row.id
                }
              });
            }}
          >
            <Link>View Courses</Link>
          </ButtonBase>
        );
      }
    }
  ];

  function filter(data: ICalendarItem_Teacher[], search: string) {
    var newData: ICalendarItem_Teacher[] = [];
    data.forEach((item: ICalendarItem_Teacher) => {
      if (item.teacherName.includes(search)) {
        newData.push(item);
      }
    });
    return newData;
  }

  function onSearchChange(search: string) {
    setSearch(search);
    const filteredData = filter(allData, search);
    setRows(filteredData);
  }

  return (
    <Box sx={{ width: '60%', margin: 'auto' }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search by username"
          inputProps={{ 'aria-label': 'search' }}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        ></StyledInputBase>
      </Search>
      <DataGrid autoHeight rows={rows} columns={columns} pageSize={20} rowsPerPageOptions={[5]} />
    </Box>
  );
}

export default ProfessorsList;
