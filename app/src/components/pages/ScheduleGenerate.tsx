import { Term } from 'components/shared/constants/timetable.constants';
import React from 'react';
import { useLocation } from 'react-router-dom';

interface IStateProps {
  semester: Term;
  year: Date;
}

function ScheduleGenerate() {
  const { state } = useLocation();
  const { semester, year } = state as IStateProps;
  return (
    <div>
      <div>ScheduleGenerate</div>
      <div>Data passed over from Schedule Manage page:</div>
      <div>{semester}</div>
      <div>{year.toISOString()}</div>
    </div>
  );
}

export default ScheduleGenerate;
