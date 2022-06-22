import { ICalendarCourseItem, ICourse, ICalendarTeacherItem } from 'components/shared/interfaces/timetable.interfaces';
import colors from 'data/CourseColor.json';
import Query from 'devextreme/data/query';
import classData from 'data/clean.json';

/**
 * Grab data from python scraper and format it for DevExtreme Scheduler
 *  Reference: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/CustomTemplates/React/Light/
 */

export function parseCalendarTeacher(data: ICourse[]): ICalendarTeacherItem[] {
  const calendarTeacherData: ICalendarTeacherItem[] = [];
  data.forEach((course: ICourse) => {
    const calendarItem: ICalendarTeacherItem = {
      id: course.professors[0].id,
      teacherName: course.professors[0].username,
      color: colors[course.professors[0].id % colors.length]
    };
    calendarTeacherData.push(calendarItem);
  });
  return calendarTeacherData;
}

export function parseCalendarCourse(data: ICourse[]): ICalendarCourseItem[] {
  const calendarCourseData: ICalendarCourseItem[] = [];
  data.forEach((course: ICourse) => {
    course.meetingTimes.forEach((element) => {
      //each meeting maps to a calendar item ex: csc105 has three calendar items: Tus, Wed, Fri.
      const courseStartDate = new Date(course.startDate);
      const courseEndDate = new Date(course.startDate);

      courseStartDate.setHours(parseInt(element.StartTime.split(':')[0]));
      courseStartDate.setMinutes(parseInt(element.StartTime.split(':')[1]));

      courseEndDate.setHours(parseInt(element.EndTime.split(':')[0]));
      courseEndDate.setMinutes(parseInt(element.EndTime.split(':')[1]));

      const calendarItem: ICalendarCourseItem = {
        text: course.CourseID.subject + course.CourseID.code, //show on subject
        courseId: course.CourseID.subject + course.CourseID.code,
        teacherId: course.professors[0].id,
        startDate: courseStartDate,
        endDate: courseEndDate,

        // *****important: only repeat the current day. For exmaple, csc105 should repeat on Tus, Wed, Fri.
        // If you double click that course shown on Tuesday, and choose 'Edit series', it will show repate on Tus.
        // And if you click same course on Wednesday, it will show repeat on Wed.
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=' + element.Day.slice(0, 2) + ';UNTIL=' + course.endDate.replaceAll('-', '')
      };
      calendarCourseData.push(calendarItem);
    });
  });
  return calendarCourseData;
}

export function getTeacherById(id: number) {
  const data: ICalendarTeacherItem[] = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));
  return Query(data).filter(['id', id]).toArray()[0];
}

// Given a data source and a professor username, return courses that professor is teaching or has taught.
export function getCoursesForProfessor(username: string, data: ICourse[]): ICourse[] {
  const courses: ICourse[] = [];
  data.forEach((course: ICourse) => {
    course.professors.forEach((professor) => {
      if (professor.username === username) {
        courses.push(course);
      }
    });
  });
  return courses;
}
