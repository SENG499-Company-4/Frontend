import {
  ICalendarCourseItem,
  ICalendarItem_Teacher,
  IHourMinute,
  IProfessorCourse,
  IProfessorIndex,
  IScheduleListItem
} from 'interfaces/timetable.interfaces';
import colors from 'data/CourseColor.json';
import { ability, willing } from 'constants/surveyForm.constants';
import { CourseSection, MeetingTime, Term, User } from 'types/api.types';

const moment = require('moment');

export function parseCalendarTeacher(data: CourseSection[]): ICalendarItem_Teacher[] {
  const calendarTeacherData: ICalendarItem_Teacher[] = [];
  data.forEach((course: CourseSection) => {
    if (course.professors && course.professors.length > 0) {
      const calendarItem: ICalendarItem_Teacher = {
        id: course.professors[0].id,
        teacherName: course.professors[0].username,
        courseId: course.CourseID.subject + course.CourseID.code,
        term: course.CourseID.term,
        color: colors[course.professors[0].id % colors.length],
        link: '/professors/' + course.professors[0].id
      };
      calendarTeacherData.push(calendarItem);
    }
  });
  return calendarTeacherData;
}

function daytoInt(day: string) {
  return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].indexOf(day);
}

// Reference: https://ianvink.wordpress.com/2021/08/25/typescript-how-to-get-the-first-monday-in-the-month/
export function firstMondayInMonth(zeroBasedMonth: number, year: number) {
  let firstMonday = moment().year(year).month(zeroBasedMonth).date(1).day(8);
  if (firstMonday.date() > 7) {
    firstMonday.day(-6);
  }
  return firstMonday;
}

export function getCourseStartDate(year: number, term: Term): Date {
  const month = () => {
    switch (term) {
      case Term.Fall:
        return 8;
      case Term.Spring:
        return 0;
      case Term.Summer:
        return 4;
      default:
        return 0;
    }
  };
  return firstMondayInMonth(month(), year).toDate();
}

export function getCurrentTerm(): Term {
  const date = new Date();
  const month: number = date.getMonth();
  if (0 <= month && month < 4) {
    return Term.Spring;
  } else if (4 <= month && month < 8) {
    return Term.Summer;
  } else {
    return Term.Fall;
  }
}

export function parseCalendarCourse(
  data: CourseSection[],
  courseId?: string,
  professorId?: number
): ICalendarCourseItem[] {
  const calendarCourseData: ICalendarCourseItem[] = [];
  let courseProp = courseId ? courseId : undefined;
  let professorProp = professorId ? professorId : undefined;

  data.forEach((course: CourseSection) => {
    // Get number of course sections for course
    const courseId = course.CourseID.subject + course.CourseID.code;
    console.log('Course ID: ', courseId);
    let numSections = 0;
    for (const courseSection of data) {
      console.log('Checking against course ID: ', courseSection.CourseID.subject + courseSection.CourseID.code);
      if (courseSection.CourseID.subject + courseSection.CourseID.code === courseId) {
        console.log('Found matching course');
        numSections++;
      }
    }
    course.meetingTimes.forEach((meetingTime: MeetingTime) => {
      //each meeting maps to a calendar item ex: csc105 has three calendar items: Tus, Wed, Fri.
      const dayshift = daytoInt(meetingTime.day);

      const courseInitDate = getCourseStartDate(course.CourseID.year, course.CourseID.term);

      const courseStartDate = new Date(courseInitDate.toISOString().substring(0, 10) + ' 00:00');
      const courseEndDate = new Date(courseInitDate.toISOString().substring(0, 10) + ' 00:00');

      const firstMonday = parseInt(course.startDate.split('-')[2]);
      const newDate = firstMonday + dayshift;
      courseStartDate.setDate(newDate);
      courseEndDate.setDate(newDate);

      const startHour = meetingTime.startTime.substring(0, 2);
      const startMinute = meetingTime.startTime.substring(2, 4);

      const endHour = meetingTime.endTime.substring(0, 2);
      const endMinute = meetingTime.endTime.substring(2, 4);

      courseStartDate.setHours(parseInt(startHour));
      courseStartDate.setMinutes(parseInt(startMinute));

      courseEndDate.setHours(parseInt(endHour));
      courseEndDate.setMinutes(parseInt(endMinute));

      const lastDay = new Date(course.endDate);
      if (lastDay.getDay() >= dayshift) {
        lastDay.setDate(parseInt(course.endDate.split('-')[2].split('T')[0]) - (lastDay.getDay() - dayshift));
      }

      const calendarItem: ICalendarCourseItem = {
        courseId: course.CourseID.subject + course.CourseID.code,
        professorsReference: course?.professors,
        teacherId: course?.professors[0].id,
        startDate: courseStartDate,
        endDate: courseEndDate,
        startDateString: course.startDate,
        endDateString: course.endDate,
        lastDay: lastDay,
        capacity: Math.floor(course.capacity / (numSections === 0 ? 1 : numSections)),
        term: course.CourseID.term,
        meetingTime: meetingTime,
        section: course?.sectionNumber,
        year: course.CourseID.year,
        title: course.CourseID.title
      };

      // Conditional return rules based on props
      if (professorProp && courseProp) {
        if (calendarItem.teacherId === professorProp && courseProp === calendarItem.courseId) {
          calendarCourseData.push(calendarItem);
        }
      } else if (courseProp && !professorProp) {
        if (calendarItem.courseId === courseProp) {
          calendarCourseData.push(calendarItem);
        }
      } else if (!courseProp && professorProp) {
        if (calendarItem.teacherId === professorProp) {
          calendarCourseData.push(calendarItem);
        }
      } else {
        calendarCourseData.push(calendarItem);
      }
    });
  });

  return calendarCourseData;
}

// Given a data source and a professor username, return courses that professor is teaching or has taught.
export function getCoursesForProfessor(id?: number, data?: CourseSection[]): CourseSection[] {
  if (!id || !data) {
    return [];
  }
  const courses: CourseSection[] = [];
  for (const course of data) {
    course?.professors?.forEach((professor: User) => {
      if (professor.id === id) {
        courses.push(course);
      }
    });
  }
  return courses;
}

export function sortByProf(data: ICalendarCourseItem[]): IProfessorIndex {
  console.log('sortByProf TRIGGERED: ', data);
  // Extract all professors from data and create a list of unique professors with class data
  const profList: IProfessorIndex = {};

  data.forEach((course: ICalendarCourseItem) => {
    const profs = course!.professorsReference!;

    for (const prof of profs) {
      // If professor is not in list, add them
      if (!profList[prof.id]) {
        profList[prof.id] = {
          id: prof.id,
          username: prof.username,
          classes: []
        };
      }

      // Add course to professor's list of classes
      const modifiedCourse: IProfessorCourse = {
        courseId: course.courseId,
        term: course.term,
        capacity: course.capacity,
        startDate: course.startDate,
        endDate: course.endDate,
        meetingTime: course.meetingTime
      };

      profList[prof.id].classes.push(modifiedCourse);
    }
  });

  return profList;
}

function compareTime(a: IHourMinute, b: IHourMinute) {
  if (a.hour > b.hour) {
    return 1;
  } else if (a.hour < b.hour) {
    return -1;
  } else {
    //hours are equal
    if (a.minute > b.minute) {
      return 1;
    } else if (a.minute < b.minute) {
      return -1;
    } else {
      return 0;
    }
  }
}

export function checkCollision(a: MeetingTime, b: MeetingTime) {
  if (a.day !== b.day) return false;

  const aStart: IHourMinute = {
    hour: parseInt(a.startTime.split(':')[0]),
    minute: parseInt(a.startTime.split(':')[1])
  };

  const aEnd: IHourMinute = {
    hour: parseInt(a.endTime.split(':')[0]),
    minute: parseInt(a.endTime.split(':')[1])
  };

  const bStart: IHourMinute = {
    hour: parseInt(b.startTime.split(':')[0]),
    minute: parseInt(b.startTime.split(':')[1])
  };

  const bEnd: IHourMinute = {
    hour: parseInt(b.endTime.split(':')[0]),
    minute: parseInt(b.endTime.split(':')[1])
  };

  if (compareTime(aEnd, bStart) > 0 && compareTime(aStart, bEnd) < 0) return true;
}

export function calculateCourseRating(able: string, willingness: string): number {
  if (able === ability.effort && willingness === willing.notWilling) {
    return 1;
  } else if (able === ability.can && willingness === willing.notWilling) {
    return 2;
  } else if (able === ability.effort && willingness === willing.willing) {
    return 3;
  } else if (able === ability.can && willingness === willing.willing) {
    return 4;
  } else if (able === ability.effort && willingness === willing.veryWilling) {
    return 5;
  } else if (able === ability.can && willingness === willing.veryWilling) {
    return 6;
  } else {
    return 0;
  }
}
