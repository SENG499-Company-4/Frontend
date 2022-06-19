import React from 'react';
import { useLocation } from 'react-router-dom';

function ScheduleGenerate() {
  const { state } = useLocation();

  return (
    <div>
      <div>ScheduleGenerate</div>
      <div>{state.semester}</div>
      <div>{state.year}</div>
    </div>

  );
}

export default ScheduleGenerate;
