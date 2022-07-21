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

const TEMP_COURSE_DATA: CourseSection[] = [
  {
    CourseID: {
      subject: 'SENG',
      title: 'Software Development Methods',
      code: '265',
      term: 'FALL',
      year: 0
    },
    hoursPerWeek: 3,
    capacity: 0,
    professors: [
      {
        id: 130,
        username: 'kskipsey',
        name: 'Kate Skipsey',
        password: '$2b$10$tDsA4Ts.DSi4Ry9DoxxQHOS.5ethLRqEFsCO9shyPDefKNaQYXahS',
        role: 'USER',
        preferences: [
          {
            id: {
              subject: 'CHEM',
              title: '',
              code: '101',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'ECON',
              title: '',
              code: '180',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'ECE',
              title: 'Introduction to Computer Architecture',
              code: '255',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Continuous-Time Signals and Systems',
              code: '260',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'ECE',
              title: 'Microprocessor-Based Systems',
              code: '355',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Control Theory and Systems I',
              code: '360',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'ENGR',
              title: '',
              code: '110',
              term: 'FALL',
              year: 2021
            },
            preference: 1
          },
          {
            id: {
              subject: 'ENGR',
              title: '',
              code: '130',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'PHYS',
              title: '',
              code: '110',
              term: 'FALL',
              year: 2021
            },
            preference: 6
          },
          {
            id: {
              subject: 'PHYS',
              title: '',
              code: '111',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'SENG',
              title: 'Software Development Methods',
              code: '265',
              term: 'FALL',
              year: 2021
            },
            preference: 6
          },
          {
            id: {
              subject: 'SENG',
              title: 'Human Computer Interaction',
              code: '310',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          }
        ],
        active: true
      }
    ],
    startDate: '2022-09-05T00:00:00.000Z',
    endDate: '2022-12-05T00:00:00.000Z',
    meetingTimes: [
      {
        day: 'TUESDAY',
        startTime: '1530-01-01T00:00:00.000Z',
        endTime: '1620-01-01T00:00:00.000Z'
      },
      {
        day: 'WEDNESDAY',
        startTime: '1530-01-01T00:00:00.000Z',
        endTime: '1620-01-01T00:00:00.000Z'
      },
      {
        day: 'FRIDAY',
        startTime: '1530-01-01T00:00:00.000Z',
        endTime: '1620-01-01T00:00:00.000Z'
      }
    ],
    sectionNumber: 'A02'
  },
  {
    CourseID: {
      subject: 'SENG',
      title: 'Software Development Methods',
      code: '265',
      term: 'FALL',
      year: 0
    },
    hoursPerWeek: 3,
    capacity: 0,
    professors: [
      {
        id: 99,
        username: 'ilampari',
        name: 'Ilamparithi Thirumarai Chelvan',
        password: '$2b$10$tDsA4Ts.DSi4Ry9DoxxQHOS.5ethLRqEFsCO9shyPDefKNaQYXahS',
        role: 'USER',
        preferences: [
          {
            id: {
              subject: 'CHEM',
              title: '',
              code: '101',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'ECON',
              title: '',
              code: '180',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'ECE',
              title: 'Introduction to Computer Architecture',
              code: '255',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Continuous-Time Signals and Systems',
              code: '260',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Microprocessor-Based Systems',
              code: '355',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Control Theory and Systems I',
              code: '360',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ENGR',
              title: '',
              code: '110',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ENGR',
              title: '',
              code: '130',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'PHYS',
              title: '',
              code: '110',
              term: 'FALL',
              year: 2021
            },
            preference: 2
          },
          {
            id: {
              subject: 'PHYS',
              title: '',
              code: '111',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'SENG',
              title: 'Software Development Methods',
              code: '265',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'SENG',
              title: 'Human Computer Interaction',
              code: '310',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          }
        ],
        active: true
      }
    ],
    startDate: '2022-09-05T00:00:00.000Z',
    endDate: '2022-12-05T00:00:00.000Z',
    meetingTimes: [
      {
        day: 'TUESDAY',
        startTime: '1200-01-01T00:00:00.000Z',
        endTime: '1250-01-01T00:00:00.000Z'
      },
      {
        day: 'WEDNESDAY',
        startTime: '1200-01-01T00:00:00.000Z',
        endTime: '1250-01-01T00:00:00.000Z'
      },
      {
        day: 'FRIDAY',
        startTime: '1200-01-01T00:00:00.000Z',
        endTime: '1250-01-01T00:00:00.000Z'
      }
    ],
    sectionNumber: 'A01'
  }
];

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
