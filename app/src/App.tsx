import { ThemeProvider } from '@emotion/react';
import appTheme from 'themes/appTheme';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './UIComponents/Header';
import Home from './PageComponents/Home';
import Login from './PageComponents/Login';
import Dashboard from './PageComponents/Dashboard';
import Survey from './PageComponents/Survey';
import Schedule from './PageComponents/Schedule';
import ScheduleManage from './PageComponents/ScheduleManage';
import ScheduleGenerate from './PageComponents/ScheduleGenerate';
import ScheduleTimetable from './PageComponents/ScheduleTimetable';
import ProfessorProfile from './PageComponents/ProfessorProfile';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <Router>
        <Header />
        <Routes>
          <Route
            path='/'
            element={[
              <Home />
            ]} />
          <Route
            path='/login'
            element={[
              <Login />
            ]} />
          <Route
            path='/dashboard'
            element={[
              <Dashboard />
            ]} />
          <Route
            path='/survey'
            element={[
              <Survey />
            ]} />
          <Route
            path='/schedule'
            element={[
              <Schedule />
            ]} />
          <Route
            path='/schedule/manage'
            element={[
              <ScheduleManage />
            ]} />
          <Route
            path='/schedule/timetable'
            element={[
              <ScheduleTimetable />
            ]} />
          <Route
            path='/schedule/generate'
            element={[
              <ScheduleGenerate />
            ]} />
          <Route
            path='/professorprofile'
            element={[
              <ProfessorProfile />
            ]} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
