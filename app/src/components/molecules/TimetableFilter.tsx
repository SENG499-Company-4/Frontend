import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import { CourseSection } from 'types/api.types';
import { Grid, TextField } from '@mui/material';

interface TimetableFilterProps {
  courseData: CourseSection[];
  disabled: boolean;
  onFilterChange: (courseData: CourseSection[]) => void;
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

  useEffect(() => {
    // Send back to schedule component when filter changes
    props.onFilterChange(filteredData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData]);

  const onStreamYearChange = (streamYear: string) => {
    setStreamYear(streamYear);
    if (streamYear === '0') {
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
      setFilteredData(newData);
    }
  };

  function hasProfessor(course: CourseSection, search: string) {
    if (!!course.professors && course.professors.length > 0) {
      for (const professor of course.professors) {
        if (!!professor && !!professor.name && professor.name.toLowerCase().includes(search.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }

  function filter(data: CourseSection[], search: string) {
    var newData: CourseSection[] = [];
    if (data) {
      const condition = (course: CourseSection) => {
        return (
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
            .includes(search.toLowerCase()) || hasProfessor(course, search)
        );
      };
      for (const course of data) {
        if (condition(course)) {
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
          style={{ width: '300px' }}
        ></TextField>
      </Grid>
    </Grid>
  );
}
