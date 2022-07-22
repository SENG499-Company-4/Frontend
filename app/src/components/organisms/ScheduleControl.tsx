import { useLazyQuery } from '@apollo/client';
import { Divider, Grid, Stack, Typography, Button } from '@mui/material';
import { GET_SCHEDULE } from 'api/Queries';
import { SemesterSelector } from 'components/molecules/SemesterSelector';
import { TimetableFilter } from 'components/molecules/TimetableFilter';
import { ErrorContext } from 'contexts/ErrorContext';
import { LoadingContext } from 'contexts/LoadingContext';
import React, { useContext, useEffect, useState } from 'react';
import { CourseSection, Term } from 'types/api.types';
import { Role } from 'constants/timetable.constants';
import Cookie from 'universal-cookie';
import { TermSelectorContext } from 'contexts/TermSelectorContext';
import { getCurrentTerm } from 'utils/utils';
interface ScheduleControlProps {
  courseDataChanged: (courseData: CourseSection[]) => void;
  exportState?: () => void;
  loadingCallback: (loading: boolean) => void;
  filter?: boolean;
  save?: boolean;
}

export function ScheduleControl(props: ScheduleControlProps) {
  const cookie = new Cookie();
  const { year, term, setYear, setTerm } = useContext(TermSelectorContext);

  const [calendarData, setCalendarData] = useState<CourseSection[]>([]);

  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  function onFilterChange(filteredCourses: CourseSection[]) {
    props.courseDataChanged(filteredCourses);
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
        {props.save && cookie.get('user').role === Role.Admin && (
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
                  onClick={props.exportState}
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
