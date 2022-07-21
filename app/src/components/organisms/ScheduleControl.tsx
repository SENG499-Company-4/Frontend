import { useLazyQuery } from '@apollo/client';
import { Divider, Grid, Stack, Typography, Button } from '@mui/material';
import { GET_SCHEDULE } from 'api/Queries';
import { SemesterSelector } from 'components/molecules/SemesterSelector';
import { TimetableFilter } from 'components/molecules/TimetableFilter';
import { ErrorContext } from 'contexts/ErrorContext';
import { LoadingContext } from 'contexts/LoadingContext';
import React, { useContext, useEffect, useState } from 'react';
import { CourseSection, Term } from 'types/api.types';

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
  loadingCallback: (loading: boolean) => void;
  filter?: boolean;
  save?: boolean;
}

export function ScheduleControl(props: ScheduleControlProps) {
  const [term, setTerm] = useState<Term | undefined>(Term.Fall); // TODO: UPDATE THIS
  const [year, setYear] = useState<Date | undefined>(new Date(2021, 0, 1)); // TODO: UPDATE THIS

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
    props.loadingCallback(scheduleLoading);
    if (scheduleData) {
      if (scheduleData.schedule) {
        setCalendarData(scheduleData.schedule.courses);
        props.courseDataChanged(scheduleData.schedule.courses);
      } else {
        setCalendarData([]);
        props.courseDataChanged([]);
      }
    }
    if (scheduleError) {
      errorContext.setErrorDialog(scheduleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleLoading, scheduleData, scheduleError]);

  return (
    <Grid item>
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
        {props.filter && (
          <>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ marginLeft: '20px', marginRight: '5px', marginTop: '20px' }}
            />
            <Grid item>
              <Stack>
                <Grid item marginBottom={'10px'}>
                  <Typography variant="h6">2. Filter</Typography>
                </Grid>
                <TimetableFilter courseData={calendarData} disabled={!year || !term} onFilterChange={onFilterChange} />
              </Stack>
            </Grid>
          </>
        )}
        {props.save && (
          <>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ marginLeft: '20px', marginRight: '5px', marginTop: '20px' }}
            />
            <Grid item>
              <Stack>
                <Grid item marginBottom={'10px'}>
                  <Typography variant="h6">3. Save</Typography>
                </Grid>
                <Button
                  sx={{ height: '56px' }}
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={exportState}
                >
                  Save Schedule
                </Button>
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}
