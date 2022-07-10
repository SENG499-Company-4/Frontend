import { LoadingContext } from 'contexts/LoadingContext';
import { IPublicRouteMeta } from 'interfaces/route.interfaces';
import { IUser } from 'interfaces/user.interfaces';
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface IPublicRouteProps {
  user?: IUser;
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
