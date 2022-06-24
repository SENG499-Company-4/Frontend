import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { parseCalendarJSON_Teacher } from 'utils/utils';
import classData from 'data/clean.json';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useState } from 'react';
import { ICalendarItem_Teacher } from 'components/shared/interfaces/timetable.interfaces';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'teacherName', headerName: 'Username', width: 130 },
    { field: 'courseId', headerName: 'Course', width: 130 },
    { field: 'term', headerName: 'Term', width: 130 },


];

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '40ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function ProfessorsList() {
    const allData: ICalendarItem_Teacher[] = parseCalendarJSON_Teacher(JSON.parse(JSON.stringify(classData)));
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
        const filtedData = filter(allData, search);
        setRows(filtedData);
    }

    return (
        <Box sx={{ width: 1000, margin: 'auto' }}>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search Teacher Name"
                    inputProps={{ 'aria-label': 'search' }}
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                ></StyledInputBase>
            </Search>
            <DataGrid autoHeight
                rows={rows}
                columns={columns}
                pageSize={20}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </Box>
    );
}

export default ProfessorsList;
