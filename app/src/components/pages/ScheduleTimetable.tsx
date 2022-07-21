import React, { useContext, useEffect, useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
// import { ICourse } from 'interfaces/timetable.interfaces';
// import { useLocation } from 'react-router-dom';
import { Button, Box, Grid, Divider, Typography, Stack } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { SemesterSelector } from 'components/molecules/SemesterSelector';
import { Schedule, Term } from 'types/api.types';
import { GET_SCHEDULE } from 'api/Queries';
import { useLazyQuery } from '@apollo/client';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { TimetableFilter } from 'components/molecules/TimetableFilter';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);

interface IStateProps {
  courseId?: string;
  professorId?: number;
}

export const getCurrentTerm = (): Term => {
  const date = new Date();
  const month: number = date.getMonth();
  if (0 <= month && month < 4) {
    return Term.Spring;
  } else if (4 <= month && month < 8) {
    return Term.Summer;
  } else {
    return Term.Fall;
  }
};

function ScheduleTimetable() {
  const location: Location = useLocation();
  const state: IStateProps = location.state as IStateProps;
  const courseId = state?.courseId ? state.courseId : undefined;
  const professorId = state?.professorId ? state.professorId : undefined;

  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  const [calendarData, setCalendarData] = useState<Schedule | undefined>(undefined);

  const [term, setTerm] = useState<Term | undefined>(getCurrentTerm());
  const [year, setYear] = useState<Date | undefined>(new Date());

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

  let calendarCourseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData)), courseId, professorId);
  let calendarTeacherData = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));

  // console.log('calendar course data: ', calendarCourseData);
  // console.log('unparsed class data: ', classData);

  function exportState() {
    console.log(calendarCourseData);
  }

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
        setCalendarData(scheduleData.schedule);
      } else {
        setCalendarData(undefined);
      }
    }
    if (scheduleError) {
      errorContext.setErrorDialog(scheduleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleLoading, scheduleData, scheduleError]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" margin="5px">
        <Grid container display={'flex'} flexDirection={'column'}>
          <Grid item>
            <Grid
              container
              display={'flex'}
              flexDirection={'row'}
              marginTop={'5px'}
              marginLeft={'5px'}
              marginBottom={'15px'}
              spacing={2}
            >
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
                  <TimetableFilter courseData={calendarData?.courses} disabled={!year || !term} />
                </Stack>
              </Grid>
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
            </Grid>
          </Grid>
          <Grid item marginLeft={'20px'} marginBottom={'10px'}>
            {professorId && <Chip color="primary" label={'Filtered by Professor ID: ' + professorId} />}
            {courseId && <Chip color="primary" label={'Filtered by Course: ' + courseId} />}
          </Grid>
        </Grid>
      </Box>

      {/*@ts-ignore*/}
      <Scheduler
        timeZone="Canada/Pacific"
        // dataSource={calendarCourseData}
        textExpr="courseId"
        views={[
          {
            type: 'day',
            name: 'Day',
            maxAppointmentsPerCell: 'auto'
          },
          {
            type: 'week',
            name: 'Week',
            maxAppointmentsPerCell: 2
          }
        ]}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        startDayHour={8}
        height={800}
        appointmentComponent={Appointment}
        showAllDayPanel={false}
        editingAppointment={false}
      >
        <Editing allowAdding={false} allowDragging={true} />
        <Resource
          dataSource={calendarTeacherData}
          fieldExpr="teacherId"
          displayExpr="teacherName"
          label="Professor"
          allowMultiple={true}
          useColorAsDefault={true}
        />
      </Scheduler>
    </>
  );
}

export default ScheduleTimetable;
