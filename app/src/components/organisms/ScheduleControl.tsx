import { useLazyQuery } from '@apollo/client';
import { Divider, Grid, Stack, Typography, Button } from '@mui/material';
import { GET_SCHEDULE } from 'api/Queries';
import { SemesterSelector } from 'components/molecules/SemesterSelector';
import { TimetableFilter } from 'components/molecules/TimetableFilter';
import { ErrorContext } from 'contexts/ErrorContext';
import { LoadingContext } from 'contexts/LoadingContext';
import React, { useContext, useEffect, useState } from 'react';
import { CourseSection, Term } from 'types/api.types';
import { TEMP_COURSE_DATA } from 'constants/timetable.constants';

export function getCurrentTerm(): Term {
  const date = new Date();
  const month: number = date.getMonth();
  if (0 <= month && month < 4) {
    return Term.Spring;
  } else if (4 <= month && month < 8) {
    return Term.Summer;
  } else {
    return Term.Fall;
  }
}

interface ScheduleControlProps {
  courseDataChanged: (courseData: CourseSection[]) => void;
}

export function ScheduleControl(props: ScheduleControlProps) {
  const [term, setTerm] = useState<Term | undefined>(getCurrentTerm());
  const [year, setYear] = useState<Date | undefined>(new Date());

  const [calendarData, setCalendarData] = useState<CourseSection[]>([]);

  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  function onFilterChange(filteredCourses: CourseSection[]) {
    props.courseDataChanged(filteredCourses);
  }

  function exportState() {
    console.log(calendarData);
  }

  useEffect(() => {
    console.log('year / term updated.', year, term);
    if (term && year) {
      fetchSchedule();
    }
    if (!term || !year) {
      getCurrentTerm();
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
      if (scheduleData.schedule) {
        setCalendarData(scheduleData.schedule.courses);
      } else {
        setCalendarData([]);
      }
    }
    if (scheduleError) {
      errorContext.setErrorDialog(scheduleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleLoading, scheduleData, scheduleError]);

  return (
    <Grid item paddingLeft={'15px'}>
      <Grid container display={'flex'} flexDirection={'row'} marginTop={'5px'} marginBottom={'15px'} spacing={2}>
        <Grid item>
          <Stack>
            <Grid item marginBottom={'10px'}>
              <Typography variant="h6">1. Select Term</Typography>
            </Grid>
            <SemesterSelector
              year={year}
              term={term}
              onTermChange={(term: Term) => {
                setTerm(term);
              }}
              onYearChange={(year: Date) => {
                setYear(year);
              }}
            />
          </Stack>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ marginLeft: '20px', marginRight: '5px', marginTop: '20px' }} />
        <Grid item>
          <Stack>
            <Grid item marginBottom={'10px'}>
              <Typography variant="h6">2. Filter</Typography>
            </Grid>
            <TimetableFilter courseData={TEMP_COURSE_DATA} disabled={!year || !term} onFilterChange={onFilterChange} />
          </Stack>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ marginLeft: '20px', marginRight: '5px', marginTop: '20px' }} />
        <Grid item>
          <Stack>
            <Grid item marginBottom={'10px'}>
              <Typography variant="h6">3. Save</Typography>
            </Grid>
            <Button sx={{ height: '56px' }} variant="contained" size="large" color="secondary" onClick={exportState}>
              Save Schedule
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}
