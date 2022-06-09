import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from 'components/organisms/Header';
import Home from 'components/pages/Home';
import Login from 'components/pages/Login';
import Dashboard from 'components/pages/Dashboard';
import Survey from 'components/pages/Survey';
import Schedule from 'components/pages/Schedule';
import ScheduleManage from 'components/pages/ScheduleManage';
import ScheduleGenerate from 'components/pages/ScheduleGenerate';
import ScheduleTimetable from 'components/pages/ScheduleTimetable';
import ProfessorProfile from 'components/pages/ProfessorProfile';

function AppRouter() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={[<Home />]} />
        <Route path="/login" element={[<Login />]} />
        <Route path="/dashboard" element={[<Dashboard />]} />
        <Route path="/survey" element={[<Survey />]} />
        <Route path="/schedule" element={[<Schedule />]} />
        <Route path="/schedule/manage" element={[<ScheduleManage />]} />
        <Route path="/schedule/timetable" element={[<ScheduleTimetable />]} />
        <Route path="/schedule/generate" element={[<ScheduleGenerate />]} />
        <Route path="/professor-profile" element={[<ProfessorProfile />]} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
