import {
  ICalendarCourseItem,
  ICalendarItem_Teacher,
  IHourMinute,
  IProfessorCourse,
  IProfessorIndex
} from 'interfaces/timetable.interfaces';
import darkModeColors from 'data/DarkColors.json';
import lightModeColors from 'data/LightColors.json';
import { ability, willing } from 'constants/surveyForm.constants';
import { CourseSection, MeetingTime, Term, User } from 'types/api.types';

export function parseCalendarTeacher(professors: User[], darkMode: boolean): ICalendarItem_Teacher[] {
  console.log('DARK MODE? ', darkMode);
  const calendarTeacherData: ICalendarItem_Teacher[] = [];
  professors.forEach((professor: User) => {
    const appointmentColor = darkMode
      ? darkModeColors[professor.id % darkModeColors.length]
      : lightModeColors[professor.id % lightModeColors.length];
    const calendarItem: ICalendarItem_Teacher = {
      id: professor.id,
      teacherName: professor.username,
      courseId: '',
      term: '',
      color: appointmentColor,
      link: '/professors/' + professor.id
    };
    calendarTeacherData.push(calendarItem);
  });
  return calendarTeacherData;
}

export function daytoInt(day: string) {
  return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].indexOf(day);
}

export function intToDay(day: number) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
}

export function garfield(year: number, term: Term): number {
  const mondays = {
    2021: {
      SPRING: 4,
      SUMMER: 3,
      FALL: 6
    },
    2022: {
      SPRING: 3,
      SUMMER: 2,
      FALL: 5
    },
    2023: {
      SPRING: 2,
      SUMMER: 1,
      FALL: 4
    },
    2024: {
      SPRING: 1,
      SUMMER: 6,
      FALL: 2
    }
  } as any;
  return mondays[year][term];
}

export function getLastFriday(year: number, term: Term): number {
  // Using first friday of the last month of a term as a rough estimation of the term ending date
  const fridays = {
    2021: {
      SPRING: 2,
      SUMMER: 6,
      FALL: 3
    },
    2022: {
      SPRING: 1,
      SUMMER: 5,
      FALL: 2
    },
    2023: {
      SPRING: 7,
      SUMMER: 4,
      FALL: 1
    },
    2024: {
      SPRING: 5,
      SUMMER: 2,
      FALL: 6
    }
  } as any;
  return fridays[year][term];
}

export function getTermMonthIndex(term: Term): number {
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
  return month();
}

export function getCourseStartDate(year: number, term: Term): Date {
  const firstMonday = garfield(year, term);
  const termIndex = getTermMonthIndex(term);
  return new Date(year, termIndex, firstMonday);
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
  let courseProp = courseId ? courseId : '';
  let professorProp = professorId ? professorId : -1;

  data.forEach((course: CourseSection) => {
    // Get number of course sections for course
    const courseId = course.CourseID.subject + course.CourseID.code;
    let numSections = 0;
    for (const courseSection of data) {
      if (courseSection.CourseID.subject + courseSection.CourseID.code === courseId) {
        numSections++;
      }
    }
    const firstMonday = garfield(course.CourseID.year, course.CourseID.term);
    course.meetingTimes.forEach((meetingTime: MeetingTime) => {
      //each meeting maps to a calendar item ex: csc105 has three calendar items: Tus, Wed, Fri.
      const dayshift = daytoInt(meetingTime.day) - 1;

      const courseInitDate = getCourseStartDate(course.CourseID.year, course.CourseID.term);

      const courseStartDate = new Date(courseInitDate.toISOString().substring(0, 10) + ' 00:00');
      const courseEndDate = new Date(courseInitDate.toISOString().substring(0, 10) + ' 00:00');

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
      if (professorProp !== -1 && courseProp !== '') {
        if (calendarItem.teacherId === professorProp && courseProp === calendarItem.courseId) {
          calendarCourseData.push(calendarItem);
        }
      } else if (courseProp !== '' && professorProp === -1) {
        if (calendarItem.courseId === courseProp) {
          calendarCourseData.push(calendarItem);
        }
      } else if (courseProp === '' && professorProp !== -1) {
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
  console.log('Same day. Comparing times...');
  if (compareTime(aEnd, bStart) > 0 && compareTime(aStart, bEnd) < 0) {
    console.log('Collision detected!');
    return true;
  }
  return false;
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
