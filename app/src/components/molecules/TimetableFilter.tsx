import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import { CourseSection } from 'types/api.types';
import { Grid, TextField } from '@mui/material';

interface TimetableFilterProps {
  courseData: CourseSection[];
  disabled: boolean;
  onSearchChange: (search: string) => void;
  onStreamChange: (stream: string) => void;
}

interface StreamItem {
  value: string;
  label: string;
}

export function TimetableFilter(props: TimetableFilterProps): React.ReactElement {
  const [search, setSearch] = useState<string>('');
  const [filteredData, setFilteredData] = useState<CourseSection[]>(props.courseData);
  const [streamYear, setStreamYear] = useState<string>('0');
  const streamOptions: StreamItem[] = [
    {
      value: '0',
      label: 'All'
    },
    {
      value: '1',
      label: 'Year 1'
    },
    {
      value: '2',
      label: 'Year 2'
    },
    {
      value: '3',
      label: 'Year 3'
    },
    {
      value: '4',
      label: 'Year 4'
    }
  ];

  const onStreamYearChange = (streamYear: string) => {
    setStreamYear(streamYear);
    if (streamYear === '0') {
      console.log('Stream year changed... Setting filtered data to: ', props.courseData);
      setFilteredData(props.courseData);
    } else {
      var newData: CourseSection[] = [];
      if (props.courseData) {
        for (const course of props.courseData) {
          if (course?.CourseID.code[0] === streamYear) {
            newData.push(course);
          }
        }
      }
      console.log('Stream year changed... Setting filtered data to: ', newData);
      setFilteredData(newData);
    }
  };

  function filter(data: CourseSection[], search: string) {
    console.log('Filtering data with search query: ', search);
    var newData: CourseSection[] = [];
    var teacherId = 0;
    // for (const teacher of calendarTeacherData) {
    //   if (teacher?.teacherName?.toLowerCase().includes(search.toLowerCase())) {
    //     teacherId = teacher?.id;
    //     for (const course of data) {
    //       if (course?.teacherId === teacherId) {
    //         newData.push(course);
    //       }
    //     }
    //     return newData;
    //   }
    // }

    if (data) {
      for (const course of data) {
        if (
          (
            course.CourseID.subject +
            ' ' +
            course.CourseID.code +
            ' ' +
            course.CourseID.term +
            ' ' +
            course.CourseID.year
          )
            .toLowerCase()
            .includes(search.toLowerCase())
        ) {
          newData.push(course);
        }
      }
    }

    return newData;
  }

  function onSearchChange(search: string) {
    setStreamYear('0');
    setSearch(search);
    const newdata = filter(props.courseData, search);
    console.log('Search query changed... Setting filtered data to: ', newdata);
    setFilteredData(newdata);
  }

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item>
        <TextField
          id="select-stream-year"
          disabled={props.disabled}
          select
          label="Stream Year"
          value={streamYear}
          onChange={(e) => onStreamYearChange(e.target.value)}
          style={{ width: '200px' }}
        >
          {streamOptions.map((streamItem: StreamItem) => (
            <MenuItem key={streamItem.value} value={streamItem.value}>
              {streamItem.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item>
        <TextField
          id="search-course"
          disabled={props.disabled}
          label="Search by Course Name or Teacher Name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ marginRight: '5px' }} />
          }}
          style={{ width: '400px' }}
        ></TextField>
      </Grid>
    </Grid>
  );
}
