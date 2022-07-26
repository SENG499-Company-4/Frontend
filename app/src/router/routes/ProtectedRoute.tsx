import ErrorPage from 'components/pages/ErrorPage';
import { Role } from 'constants/timetable.constants';
import { LoadingContext } from 'contexts/LoadingContext';
import { IProtectedRouteMeta } from 'interfaces/route.interfaces';
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserCookie } from 'router/AppRouter';

interface IProtectedRouteProps {
  user: UserCookie;
  meta: IProtectedRouteMeta;
  children: React.ReactNode;
}

export function ProtectedRoute(props: IProtectedRouteProps) {
  const location = useLocation();
  const loadingContext = useContext(LoadingContext);
  const acceptedRoles = props.meta.role;

  useEffect(() => {
    loadingContext.setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!props.user) {
    // Redirect to login page if user is not logged in
    window.location.href = '/login';
    return null;
  }

  if (acceptedRoles.includes(props.user.role as Role)) {
    return <div>{props.children}</div>;
  } else {
    // Redirect to 401 page if user is not authorized
    return <ErrorPage code={'401'} message="You are not authorized to access this page." />;
  }
}
