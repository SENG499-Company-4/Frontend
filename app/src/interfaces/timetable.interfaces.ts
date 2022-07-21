import { User } from 'types/api.types';

export interface ICalendarCourseItem {
  courseId: string;
  teacherId: number;
  startDate: Date;
  endDate: Date;
  recurrenceRule: string;
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
