import { ThemeProvider } from '@emotion/react';
import appTheme from 'themes/appTheme';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './UIComponents/Header';
// import Home from './PageComponents/Home';
import Login from './PageComponents/Login';
import Dashboard from './PageComponents/Dashboard';
import Survey from './PageComponents/Survey';
import Schedule from './PageComponents/Schedule';
import ScheduleManage from './PageComponents/ScheduleManage';
import ScheduleGenerate from './PageComponents/ScheduleGenerate';
import ScheduleTimetable from './PageComponents/ScheduleTimetable';
import ProfessorProfile from './PageComponents/ProfessorProfile';

import Splash from './PageComponents/Splash';
import ErrorPage from 'PageComponents/ErrorPage';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <Router>
        <Routes>
          <Route
            path='/'
            element={[
              <Splash />
            ]} />

          <Route
            path='/login'
            element={[
              <Header />,
              <Login />
            ]} />
          <Route
            path='/dashboard'
            element={[
              <Header />,
              <Dashboard />
            ]} />
          <Route
            path='/survey'
            element={[
              <Header />,
              <Survey />
            ]} />
          <Route
            path='/schedule'
            element={[
              <Header />,
              <Schedule />
            ]} />
          <Route
            path='/schedule/manage'
            element={[
              <Header />,
              <ScheduleManage />
            ]} />
          <Route
            path='/schedule/timetable'
            element={[
              <Header />,
              <ScheduleTimetable />
            ]} />
          <Route
            path='/schedule/generate'
            element={[
              <Header />,
              <ScheduleGenerate />
            ]} />
          <Route
            path='/professorprofile'
            element={[
              <Header />,
              <ProfessorProfile />
            ]} />
          <Route
            path='/errorpage'
            element={[
              <ErrorPage />
            ]} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
