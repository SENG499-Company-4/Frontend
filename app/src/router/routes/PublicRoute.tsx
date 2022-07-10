import { IPublicRouteMeta } from 'interfaces/route.interfaces';
import { IUser } from 'interfaces/user.interfaces';
import React from 'react';

interface IPublicRouteProps {
  user?: IUser;
  meta: IPublicRouteMeta;
  children: React.ReactNode;
}

export function PublicRoute(props: IPublicRouteProps) {
  return <div>{props.children}</div>;
}
