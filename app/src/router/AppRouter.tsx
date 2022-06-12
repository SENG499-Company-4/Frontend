import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from 'components/organisms/Header';
import Home from 'components/pages/Home';
import Login from 'components/pages/Login';
import Register from 'components/pages/Register';
import Dashboard from 'components/pages/Dashboard';
import Survey from 'components/pages/Survey';
import Schedule from 'components/pages/Schedule';
import ScheduleManage from 'components/pages/ScheduleManage';
import ScheduleGenerate from 'components/pages/ScheduleGenerate';
import ScheduleTimetable from 'components/pages/ScheduleTimetable';
import ProfessorProfile from 'components/pages/ProfessorProfile';
import ErrorPage from 'components/pages/ErrorPage';
import {
  PublicRouteMeta,
  AdminRouteMeta,
  ProfessorRouteMeta,
  ProtectedRouteMeta
} from 'components/shared/constants/route.constants';
import { PublicRoute } from 'router/routes/PublicRoute';
import { ProtectedRoute } from 'router/routes/ProtectedRoute';
import Cookie from 'universal-cookie';
import { IUser } from 'components/shared/interfaces/user.interfaces';

function AppRouter() {
  const cookie = new Cookie();
  const user: IUser = cookie.get('user');

  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={[
            <PublicRoute user={user} meta={PublicRouteMeta}>
              <Home />
            </PublicRoute>
          ]}
        />
        <Route
          path="/login"
          element={[
            <PublicRoute user={user} meta={PublicRouteMeta}>
              <Login />
            </PublicRoute>
          ]}
        />
        <Route
          path="/register"
          element={[
            <PublicRoute user={user} meta={PublicRouteMeta}>
              <Register />
            </PublicRoute>
          ]}
        />
        <Route
          path="/dashboard"
          element={[
            <ProtectedRoute user={user} meta={ProtectedRouteMeta}>
              <Dashboard />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/survey"
          element={[
            <ProtectedRoute user={user} meta={ProfessorRouteMeta}>
              <Survey />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/schedule"
          element={[
            <ProtectedRoute user={user} meta={AdminRouteMeta}>
              <Schedule />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/schedule/manage"
          element={[
            <ProtectedRoute user={user} meta={AdminRouteMeta}>
              <ScheduleManage />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/schedule/timetable"
          element={[
            <ProtectedRoute user={user} meta={AdminRouteMeta}>
              <ScheduleTimetable />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/schedule/generate"
          element={[
            <ProtectedRoute user={user} meta={AdminRouteMeta}>
              <ScheduleGenerate />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/professor-profile"
          element={[
            <ProtectedRoute user={user} meta={AdminRouteMeta}>
              <ProfessorProfile />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/error"
          element={[
            <PublicRoute user={user} meta={AdminRouteMeta}>
              <ErrorPage />
            </PublicRoute>
          ]}
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
