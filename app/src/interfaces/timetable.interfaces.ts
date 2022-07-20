import { Faculty, Role, Term, WeekDay } from 'constants/timetable.constants';

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
  password?: string;
  faculty?: Faculty;
  role: Role;
  preferences: IProfessorPreference[];
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
  courseId: string;
  teacherId: number;
  capacity: number; //TODO replace with section number later
  startDate: Date;
  endDate: Date;
  recurrenceRule: string;
}

export interface IScheduleListItem {
  courseNumber: string;
  title: string;
  professors: IProfessor[];
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
};

export interface IProfessorIndexEntry {
  id: number;
  username: string;
  faculty?: Faculty;
  role: Role;
  active: boolean;
  classes: IProfessorCourse[];
}

export interface IProfessorCourse {
  courseId: string;
  capacity: number;
  startDate: string;
  endDate: string;
  meetingTimes: IMeetingTime[];
}

export interface ICalendarError {
  courseId: string;
  capacity: number; //TODO replace with section number later
  type: string;
  message: string;
  startDate: Date;
  endDate: Date;
  professorId: number
}