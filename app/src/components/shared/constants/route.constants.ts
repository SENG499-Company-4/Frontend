import { Role } from 'components/shared/constants/timetable.constants';
import { IPublicRouteMeta, IProtectedRouteMeta } from '../interfaces/route.interfaces';

export const AdminRouteMeta: IProtectedRouteMeta = {
  auth: true,
  role: [Role.Admin]
};

export const ProfessorRouteMeta: IProtectedRouteMeta = {
  auth: true,
  role: [Role.User]
};

export const ProtectedRouteMeta: IProtectedRouteMeta = {
  auth: true,
  role: [Role.Admin, Role.User]
};

export const PublicRouteMeta: IPublicRouteMeta = {
  auth: false
};
