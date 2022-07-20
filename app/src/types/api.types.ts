export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

/** Returned when a user logs in our logs out. */
export type AuthPayload = {
  __typename?: 'AuthPayload';
  /** Optional error message if success is false */
  message?: Maybe<Scalars['String']>;
  /** Whether auth operation was successful or not */
  success: Scalars['Boolean'];
  /** Auth token used for future requests */
  token: Scalars['String'];
};

export type ChangeUserPasswordInput = {
  currentPassword: Scalars['String'];
  /** ID of user to change password for */
  id: Scalars['Int'];
  newPassword: Scalars['String'];
};

/** Company 3 and 4 */
export enum Company {
  Company3 = 'COMPANY3',
  Company4 = 'COMPANY4'
}

export type CourseId = {
  __typename?: 'CourseID';
  /** Course code, e.g. 499, 310 */
  code: Scalars['String'];
  /** Course subject, e.g. SENG, CSC */
  subject: Scalars['String'];
  /** Term course is offered in */
  term: Term;
  /** Course Title e.g. Introduction to Artificial Intelligence */
  title?: Maybe<Scalars['String']>;
  /** Year course is offered in */
  year: Scalars['Int'];
};

export type CourseInput = {
  /** Course code, e.g. 499, 310 */
  code: Scalars['String'];
  /** Number of sections in the course */
  section: Scalars['Int'];
  /** Course subject, e.g. SENG, CSC */
  subject: Scalars['String'];
};

export type CoursePreference = {
  __typename?: 'CoursePreference';
  id: CourseId;
  preference: Scalars['Int'];
};

export type CoursePreferenceInput = {
  /** Course code, e.g. 499, 310 */
  code: Scalars['String'];
  preference: Scalars['Int'];
  /** Course subject, e.g. SENG, CSC */
  subject: Scalars['String'];
  /** Term course is offered in */
  term: Term;
};

/** A set of CourseSections with matching CourseID represent a course offering */
export type CourseSection = {
  __typename?: 'CourseSection';
  /** The course identifier */
  CourseID: CourseId;
  /** Maximum capacity of the section */
  capacity: Scalars['Int'];
  /** The end date of the course */
  endDate: Scalars['Date'];
  /** How many hours per week a course takes */
  hoursPerWeek: Scalars['Float'];
  /** Days of the week the class is offered in - see Day */
  meetingTimes: Array<MeetingTime>;
  /** Professor's info, if any professors are assigned */
  professors?: Maybe<Array<User>>;
  /** Section number for courses, eg: A01, A02 */
  sectionNumber?: Maybe<Scalars['String']>;
  /** The start date of the course */
  startDate: Scalars['Date'];
};

export type CreateTeachingPreferenceInput = {
  courses: Array<CoursePreferenceInput>;
  fallTermCourses?: InputMaybe<Scalars['Int']>;
  hasRelief: Scalars['Boolean'];
  hasTopic: Scalars['Boolean'];
  nonTeachingTerm?: InputMaybe<Term>;
  peng: Scalars['Boolean'];
  reliefReason?: InputMaybe<Scalars['String']>;
  springTermCourses?: InputMaybe<Scalars['Int']>;
  summerTermCourses?: InputMaybe<Scalars['Int']>;
  topicDescription?: InputMaybe<Scalars['String']>;
  userId: Scalars['ID'];
};

export type CreateUserInput = {
  name?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  role: Role;
  username: Scalars['String'];
};

export type CreateUserMutationResult = {
  __typename?: 'CreateUserMutationResult';
  message?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  username?: Maybe<Scalars['String']>;
};

/** Days of the Week */
export enum Day {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type Error = {
  __typename?: 'Error';
  errors?: Maybe<Array<Error>>;
  message: Scalars['String'];
};

export type GenerateScheduleInput = {
  algorithm1: Company;
  algorithm2: Company;
  fallCourses?: InputMaybe<Array<CourseInput>>;
  springCourses?: InputMaybe<Array<CourseInput>>;
  summerCourses?: InputMaybe<Array<CourseInput>>;
  year: Scalars['Int'];
};

/** Weekday and time of a course section offering */
export type MeetingTime = {
  __typename?: 'MeetingTime';
  /** Weekday - see DayEnum */
  day: Day;
  /** End time */
  endTime: Scalars['Date'];
  /** Start time */
  startTime: Scalars['Date'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Change the password of the currently logged in user */
  changeUserPassword: Response;
  /** Teaching preferences */
  createTeachingPreference: Response;
  /** Register a new user account */
  createUser: CreateUserMutationResult;
  /** Generate schedule */
  generateSchedule: Response;
  /** Login into a user account using email and password */
  login: AuthPayload;
  /** Logout the currently logged in user */
  logout: AuthPayload;
  /** Reset a users password. */
  resetPassword: ResetPasswordMutationResult;
  /** Updates a user given the user id. */
  updateUser?: Maybe<UpdateUserMutationResult>;
};

export type MutationChangeUserPasswordArgs = {
  input: ChangeUserPasswordInput;
};

export type MutationCreateTeachingPreferenceArgs = {
  input: CreateTeachingPreferenceInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationGenerateScheduleArgs = {
  input: GenerateScheduleInput;
};

export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type MutationResetPasswordArgs = {
  id: Scalars['ID'];
};

export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  /** Get all users */
  allUsers?: Maybe<Array<User>>;
  /** Get all courses preferences */
  coursePreferences?: Maybe<Array<CoursePreference>>;
  /** Get a list of courses for a given term and/or year */
  courses?: Maybe<Array<CourseSection>>;
  /** Find a user by their id */
  findUserById?: Maybe<User>;
  /** Get the current user */
  me?: Maybe<User>;
  /** Schedule for a given term. If year is given, returns the most recent schedule generated for that year. */
  schedule?: Maybe<Schedule>;
  /** Get Teaching Preference Survey for the current user */
  survey: TeachingPreferenceSurvey;
};

export type QueryCoursesArgs = {
  term?: InputMaybe<Term>;
  year?: InputMaybe<Scalars['Int']>;
};

export type QueryFindUserByIdArgs = {
  id: Scalars['Int'];
};

export type QueryScheduleArgs = {
  year?: InputMaybe<Scalars['Int']>;
};

export type ResetPasswordMutationResult = {
  __typename?: 'ResetPasswordMutationResult';
  /** Optional error message */
  message?: Maybe<Scalars['String']>;
  /** New user password */
  password?: Maybe<Scalars['String']>;
  /** Whether the password was successfully reset */
  success: Scalars['Boolean'];
};

export type Response = {
  __typename?: 'Response';
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

/** User role */
export enum Role {
  /** Administrator role (department staff etc.) */
  Admin = 'ADMIN',
  /** User role (professor, student etc.) */
  User = 'USER'
}

/** Generated schedule for a year */
export type Schedule = {
  __typename?: 'Schedule';
  /** Scheduled courses */
  courses?: Maybe<Array<CourseSection>>;
  /** When the schedule was generated */
  createdAt: Scalars['Date'];
  /** ID of the schedule */
  id: Scalars['ID'];
  /** Year for the schedule */
  year: Scalars['Int'];
};

/** Generated schedule for a year */
export type ScheduleCoursesArgs = {
  term: Term;
};

export type TeachingPreferenceSurvey = {
  __typename?: 'TeachingPreferenceSurvey';
  courses: Array<CoursePreference>;
};

/** UVic Terms */
export enum Term {
  Fall = 'FALL',
  Spring = 'SPRING',
  Summer = 'SUMMER'
}

export type UpdateUserInput = {
  /** New active status of user */
  active?: InputMaybe<Scalars['Boolean']>;
  /** User id to be changed */
  id: Scalars['Int'];
  /** New name of user */
  name?: InputMaybe<Scalars['String']>;
  /** New role of user */
  role?: InputMaybe<Role>;
};

export type UpdateUserMutationResult = {
  __typename?: 'UpdateUserMutationResult';
  errors?: Maybe<Array<Error>>;
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  /** Determine if the user is marked active */
  active: Scalars['Boolean'];
  /** User id */
  id: Scalars['Int'];
  /** Name of the user */
  name?: Maybe<Scalars['String']>;
  /** Password */
  password: Scalars['String'];
  /** Teaching preferences */
  preferences?: Maybe<Array<CoursePreference>>;
  /** role - see enum Role */
  role: Role;
  /** Username */
  username: Scalars['String'];
};
