import { LoadingContext } from 'contexts/LoadingContext';
import { IPublicRouteMeta } from 'interfaces/route.interfaces';
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UserCookie } from 'router/AppRouter';

interface IPublicRouteProps {
  user?: UserCookie;
  meta: IPublicRouteMeta;
  children: React.ReactNode;
}

export function PublicRoute(props: IPublicRouteProps) {
  const location = useLocation();
  const loadingContext = useContext(LoadingContext);

  useEffect(() => {
    loadingContext.setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return <div>{props.children}</div>;
}
