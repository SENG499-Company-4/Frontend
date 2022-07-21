import { MeetingTime, Term, User } from 'types/api.types';

export interface ICalendarCourseItem {
  courseId: string;
  teacherId: number;
  startDate: Date;
  endDate: Date;
  lastDay: Date;
  capacity: number; //TODO replace with section number later
  meetingTime: MeetingTime;
  term: Term;
}

export interface IScheduleListItem {
  courseNumber: string;
  title: string;
  professors: User[];
  startDate: string;
  endDate: string;
  timeOfDay: string;
  daysOffered: string[];
  section?: string;
  capacity?: number;
}

export interface ICalendarItem_Teacher {
  courseId: string;
  term: string;
  id: number;
  teacherName: string;
  color: string;
  link: string;
}

export interface IProfessorIndex {
  [key: number]: IProfessorIndexEntry;
}

export interface IProfessorIndexEntry {
  id: number;
  username: string;
  classes: IProfessorCourse[];
}

export interface IProfessorCourse {
  courseId: string;
  term: Term;
  capacity: number; //TODO refactor to section number later
  startDate: Date;
  endDate: Date;
  meetingTime: MeetingTime;
}

export interface ICalendarError {
  courseId: string;
  capacity: number; //TODO refactor to section number later
  type: string;
  message: string;
  startDate: Date;
  endDate: Date;
  professorId: number;
}

export interface IHourMinute {
  hour: number;
  minute: number;
}
