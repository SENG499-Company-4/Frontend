import ErrorPage from 'components/pages/ErrorPage';
import { Role } from 'components/shared/constants/timetable.constants';
import { IProtectedRouteMeta } from 'components/shared/interfaces/route.interfaces';
import { IUser } from 'components/shared/interfaces/user.interfaces';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IProtectedRouteProps {
  user: IUser;
  meta: IProtectedRouteMeta;
  children: React.ReactNode;
}

export function ProtectedRoute(props: IProtectedRouteProps) {
  console.log('Protected Route Props: ', props);

  const navigate = useNavigate();
  if (!props.user) {
    // Redirect to 401 page if user is not logged in
    navigate('/login');
    return null;
  }
  const acceptedRoles = props.meta.role;
  if (acceptedRoles.includes(props.user.role as Role)) {
    return <div>{props.children}</div>;
  } else {
    // Redirect to 401 page if user is not authorized
    return <ErrorPage code={'401'} message="You are not authorized to access this page." />;
  }
}
