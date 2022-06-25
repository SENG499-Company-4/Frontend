import { Faculty, Role, Term, WeekDay } from 'components/shared/constants/timetable.constants';

export interface IProfessorPreference {
  id: ICourseID;
  preference: number;
}

export interface ICourseID {
  subject: Faculty;
  code: string;
  term: Term;
}

export interface IProfessor {
  id: number;
  username: string;
  password: string;
  role: Role;
  preferences: IProfessorPreference;
  active: boolean;
}

export interface IMeetingTime {
  Day: WeekDay;
  StartTime: string;
  EndTime: string;
}

export interface ICourse {
  CourseID: ICourseID;
  hoursPerWeek: number;
  capacity: number;
  professors: IProfessor[];
  startDate: string;
  endDate: string;
  meetingTimes: IMeetingTime[];
}

export interface ICalendarCourseItem {
  text: string;
  courseId: string;
  teacherId: number;
  startDate: Date;
  endDate: Date;
  recurrenceRule: string;
}

export interface ICalendarTeacherItem {
  id: number;
  teacherName: string;
  color: string;
}
