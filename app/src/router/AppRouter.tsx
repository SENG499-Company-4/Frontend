import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from 'components/organisms/Header';
import Home from 'components/pages/Home';
import Login from 'components/pages/Login';
import Register from 'components/pages/Register';
import Survey from 'components/pages/Survey';
import ScheduleManage from 'components/pages/ScheduleManage';
import ScheduleGenerate from 'components/pages/ScheduleGenerate';
import ScheduleTimetable from 'components/pages/ScheduleTimetable';
import ProfessorProfile from 'components/pages/ProfessorProfile';
import ProfessorsList from 'components/pages/ProfessorsList';
import ErrorPage from 'components/pages/ErrorPage';
import PlugAndPlay from 'components/pages/PlugAndPlay';
import { PublicRouteMeta, AdminRouteMeta, ProfessorRouteMeta, ProtectedRouteMeta } from 'constants/route.constants';
import { PublicRoute } from 'router/routes/PublicRoute';
import { ProtectedRoute } from 'router/routes/ProtectedRoute';
import { IUser } from 'interfaces/user.interfaces';
import Cookie from 'universal-cookie';
import ScheduleList from 'components/pages/ScheduleList';

function AppRouter() {
  const cookie = new Cookie();
  const user: IUser = cookie.get('user');

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route
          path="/"
          element={[
            <ProtectedRoute user={user} meta={ProtectedRouteMeta}>
              <Home />
            </ProtectedRoute>
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
            <ProtectedRoute user={user} meta={AdminRouteMeta}>
              <Register />
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
            <ProtectedRoute user={user} meta={ProtectedRouteMeta}>
              <ScheduleList />
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
            <ProtectedRoute user={user} meta={ProtectedRouteMeta}>
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
          path="/professors"
          element={[
            <ProtectedRoute user={user} meta={AdminRouteMeta}>
              <ProfessorsList />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/professors/:id"
          element={[
            <ProtectedRoute user={user} meta={ProtectedRouteMeta}>
              <ProfessorProfile />
            </ProtectedRoute>
          ]}
        />
        <Route
          path="/plug-and-play"
          element={[
            <ProtectedRoute user={user} meta={AdminRouteMeta}>
              <PlugAndPlay />
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
        <Route
          path="*"
          element={[
            <PublicRoute user={user} meta={PublicRouteMeta}>
              <ErrorPage code={'404'} message={'Page not found'} />
            </PublicRoute>
          ]}
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
