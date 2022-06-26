import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { parseCalendarTeacher } from 'utils/utils';
import classData from 'data/clean.json';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper, StyledInputBase } from 'components/styles/styles';
import { useState } from 'react';
import { ICalendarTeacherItem } from 'components/shared/interfaces/timetable.interfaces';
import Link from '@mui/material/Link';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'teacherName', headerName: 'Username', width: 130 },
  {
    field: 'link',
    headerName: 'View Professor Profile',
    width: 200,
    renderCell: (params: any) => <Link href={params.value}> View profile </Link>
  }
];

function ProfessorsList() {
  const allData: ICalendarTeacherItem[] = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));
  const [search, setSearch] = useState<string>('');
  const [rows, setRows] = useState<any>(allData);

  function filter(data: any, search: any) {
    var newData: any = [];
    data.map((item: any) => {
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

