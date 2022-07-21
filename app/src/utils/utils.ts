import { ICalendarCourseItem, ICalendarItem_Teacher, IScheduleListItem } from 'interfaces/timetable.interfaces';
import colors from 'data/CourseColor.json';
import { ability, willing } from 'constants/surveyForm.constants';
import { CourseSection, MeetingTime, User } from 'types/api.types';

/**
 * Grab data from python scraper and format it for DevExtreme Scheduler
 *  Reference: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/CustomTemplates/React/Light/
 */

export function parseCalendarTeacher(data: CourseSection[]): ICalendarItem_Teacher[] {
  console.log('DATA for parseCalendarTeacher: ', data);
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

export function parseCalendarCourse(
  data: CourseSection[],
  courseId?: string,
  professorId?: number
): ICalendarCourseItem[] {
  console.log('DATA for parseCalendarCourse: ', data);
  const calendarCourseData: ICalendarCourseItem[] = [];
  let courseProp = courseId ? courseId : undefined;
  let professorProp = professorId ? professorId : undefined;

  data.forEach((course: CourseSection) => {
    course.meetingTimes.forEach((meetingTime: MeetingTime) => {
      //each meeting maps to a calendar item ex: csc105 has three calendar items: Tus, Wed, Fri.
      const courseStartDate = new Date(course.startDate);
      const courseEndDate = new Date(course.startDate);

      courseStartDate.setHours(parseInt(meetingTime.startTime.split(':')[0]));
      courseStartDate.setMinutes(parseInt(meetingTime.startTime.split(':')[1]));

      courseEndDate.setHours(parseInt(meetingTime.endTime.split(':')[0]));
      courseEndDate.setMinutes(parseInt(meetingTime.endTime.split(':')[1]));

      const calendarItem: ICalendarCourseItem = {
        courseId: course.CourseID.subject + course.CourseID.code,
        teacherId: course?.professors[0].id,
        startDate: courseStartDate,
        endDate: courseEndDate,

        // *****important: only repeat the current day. For exmaple, csc105 should repeat on Tus, Wed, Fri.
        // If you double click that course shown on Tuesday, and choose 'Edit series', it will show repate on Tus.
        // And if you click same course on Wednesday, it will show repeat on Wed.
        recurrenceRule:
          'FREQ=WEEKLY;BYDAY=' + meetingTime.day.slice(0, 2) + ';UNTIL=' + course.endDate.replaceAll('-', '')
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

export function parseScheduleListItems(data: CourseSection[]): IScheduleListItem[] {
  console.log('DATA for parseScheduleListItems: ', data);
  const scheduleListItemData: IScheduleListItem[] = [];
  data.forEach((course: CourseSection) => {
    const daysOfWeek: string[] = [];
    course.meetingTimes.forEach((element) => {
      if (element.day === 'THURSDAY') {
        daysOfWeek.push('R');
      } else {
        daysOfWeek.push(element.day.slice(0, 1));
      }
    });
    const scheduleListItem: IScheduleListItem = {
      courseNumber: course.CourseID.code,
      title: course.CourseID.subject + course.CourseID.code,
      professors: course?.professors,
      startDate: course.startDate,
      endDate: course.endDate,
      timeOfDay: course.meetingTimes[0].startTime + ' - ' + course.meetingTimes[0].endTime,
      daysOffered: daysOfWeek,
      capacity: course.capacity
    };
    scheduleListItemData.push(scheduleListItem);
  });
  return scheduleListItemData;
}

// Given a data source and a professor username, return courses that professor is teaching or has taught.
export function getCoursesForProfessor(id?: number, data?: CourseSection[]): CourseSection[] {
  console.log('DATA for getCoursesForProfessor: ', data);
  console.log('ID for getCoursesForProfessor: ', id);
  if (!id || !data) {
    return [];
  }
  const today = new Date();
  const courses: CourseSection[] = [];
  data.forEach((course: CourseSection) => {
    course?.professors?.forEach((professor: User) => {
      if (professor.id === id) {
        if (new Date(course.startDate) <= today && new Date(course.endDate) >= today) {
          courses.push(course);
        }
      }
    });
  });
  return courses;
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
