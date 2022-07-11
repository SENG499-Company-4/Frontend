import { Role } from 'constants/timetable.constants';

export interface IPublicRouteMeta {
  auth: boolean;
  role?: Role[];
}

export interface IProtectedRouteMeta {
  auth: boolean;
  role: Role[];
}
