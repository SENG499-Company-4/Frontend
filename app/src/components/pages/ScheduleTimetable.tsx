import React, { useContext, useEffect, useState } from 'react';
import { Scheduler, Editing, Resource } from 'devextreme-react/scheduler';
import 'devextreme/dist/css/dx.light.css';
import Appointment from 'components/organisms/Appointment';
import classData from 'data/clean.json';
import { parseCalendarCourse, parseCalendarTeacher } from 'utils/utils';
// import { ICourse } from 'interfaces/timetable.interfaces';
// import { useLocation } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { Location, useLocation } from 'react-router-dom';
import { Chip } from '@mui/material';
import { SemesterSelector } from 'components/molecules/SemesterSelector';
import { Term } from 'types/api.types';
import { GET_SCHEDULE } from 'api/Queries';
import { useLazyQuery } from '@apollo/client';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';

//The current date will be +1 month in the UI, ex: 2021/Dec/10 -> 2022/Jan/10
const currentDate = new Date(2021, 12, 10);

interface IStateProps {
  courseId?: string;
  professorId?: number;
}

function ScheduleTimetable() {
  const location: Location = useLocation();
  const state: IStateProps = location.state as IStateProps;
  const courseId = state?.courseId ? state.courseId : undefined;
  const professorId = state?.professorId ? state.professorId : undefined;
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);
  const [calendarData, setCalendarData] = useState([]);

  let calendarCourseData = parseCalendarCourse(JSON.parse(JSON.stringify(classData)), courseId, professorId);
  let calendarTeacherData = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));

  console.log('calendar course data: ', calendarCourseData);
  console.log('unparsed class data: ', classData);
  function exportState() {
    console.log(calendarCourseData);
  }

  const [term, setTerm] = useState<Term | null>(null);
  const [year, setYear] = useState<Date | null>(null);

  useEffect(() => {
    if (term && year) {
      fetchSchedule();
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
    }
    if (scheduleError) {
      errorContext.setErrorDialog(scheduleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleLoading, scheduleData, scheduleError]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" margin="5px">
        <div>
          <div>
            <Box style={{ marginBottom: '5px', marginTop: '5px' }}>
              <SemesterSelector
                year={undefined}
                term={undefined}
                onTermChange={(term: Term) => {
                  console.log('TERM CHANGED: ', term);
                  setTerm(term);
                }}
                onYearChange={(year: Date) => {
                  console.log('YEAR CHANGED: ', year);
                  setYear(year);
                }}
              />
            </Box>
          </div>
          <div>
            {professorId && (
              <Chip
                color="primary"
                label={'Filtered by Professor: ' + professorId}
                sx={{
                  margin: '10px'
                }}
              />
            )}
            {courseId && (
              <Chip
                color="primary"
                label={'Filtered by Course: ' + courseId}
                sx={{
                  margin: '10px'
                }}
              />
            )}
          </div>
        </div>

        <Button variant="contained" size="large" color="secondary" onClick={exportState}>
          Save Schedule
        </Button>
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
