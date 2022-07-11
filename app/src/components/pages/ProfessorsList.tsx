import React, { useContext, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, ButtonBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper, StyledInputBase } from 'components/styles/styles';
import { useState } from 'react';
import { ICalendarItem_Teacher } from 'interfaces/timetable.interfaces';
import Link from '@mui/material/Link';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { useQuery } from '@apollo/client';
import { GET_PROFESSORS } from 'api/Queries';

function ProfessorsList() {
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);
  const [search, setSearch] = useState<string>('');
  const [rows, setRows] = useState<ICalendarItem_Teacher[]>([]);
  const navigate: NavigateFunction = useNavigate();

  const {
    data: professorsListData,
    loading: professorsListLoading,
    error: professorsListError
  } = useQuery(GET_PROFESSORS);

  useEffect(() => {
    loadingContext.setLoading(professorsListLoading);
    if (professorsListData) {
      setRows(professorsListData.allUsers);
    }
    if (professorsListError) {
      errorContext.setErrorDialog(professorsListError);
    }
  }, [professorsListData, professorsListLoading, professorsListError]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'username', headerName: 'Username', width: 100 },
    { field: 'role', headerName: 'Role', width: 100 },
    {
      field: 'link',
      headerName: 'View Professor Profile',
      width: 200,
      renderCell: (params) => {
        return <Link href={'/professors/' + params.id}> View profile </Link>;
      }
    },
    {
      field: 'courses',
      headerName: 'Currently Teaching',
      width: 300,
      renderCell: (params) => {
        return (
          <ButtonBase
            onClick={() => {
              navigate('/schedule/timetable', {
                state: {
                  professorId: params.id
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
    const filteredData = filter(rows, search);
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
      <DataGrid autoHeight rows={rows} columns={columns} rowsPerPageOptions={[5]} />
    </Box>
  );
}

export default ProfessorsList;
