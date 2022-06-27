export type AuthPayload = {
  message?: String;
  success: Boolean;
  token: String;
};

export type CourseID = {
  code: String;
  subject: String;
  term: Term;
};

export type CoursePreference = {
  id: CourseID;
  preference: Number;
};

export type CourseSection = {
  CourseID: CourseID;
  capacity: Number;
  endDate: Date;
  hoursPerWeek: Number;
  meetingTimes: MeetingTime[];
  professors: User[];
  startDate: Date;
};

export type CreateUserMutationResult = {
  message?: String;
  password?: String;
  success: Boolean;
  username?: String;
};

export type Error = {
  errors: Error[];
  message: String;
};

export type MeetingTime = {
  day: Day;
  endTime: Date;
  startTime: Date;
};

export type Mutation = {
  changeUserPassword: Response;
  createUser: CreateUserMutationResult;
  generateSchedule: Response;
  login: AuthPayload;
  logout: AuthPayload;
  resetPassword: ResetPasswordMutationResult;
  updateUser: UpdateUserMutationResult;
};

export type Query = {
  courses: CourseSection[];
  findUserById: User;
  me: User;
  schedule: String;
  survey: TeachingPreferenceSurvey;
};

export type ResetPasswordMutationResult = {
  message?: String;
  password: String;
  success: Boolean;
};

export type Response = {
  message?: String;
  success: Boolean;
};

export type Schedule = {
  courses: CourseSection[];
  createdAt: Date;
  id: String;
  year: Number;
};

export type TeachingPreferenceSurvey = {
  courses: CoursePreference;
};

export type UpdateUserMutationResult = {
  errors: Error[];
  user: User;
};

export type User = {
  active: Boolean;
  id: Number;
  name?: String;
  password: String;
  preferences: CoursePreference[];
  role: Role;
  username: String;
};

export enum Day {
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
}

export enum Role {
  'ADMIN',
  'USER'
}

export enum Term {
  'FALL',
  'SPRING',
  'SUMMER'
}
