import { ICalendarCourseItem, ICourse, ICalendarItem_Teacher } from 'components/shared/interfaces/timetable.interfaces';
import colors from 'data/CourseColor.json';
import Query from 'devextreme/data/query';
import classData from 'data/clean.json';

/**
 * Grab data from python scraper and format it for DevExtreme Scheduler
 *  Reference: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/CustomTemplates/React/Light/
 */

export function parseCalendarTeacher(data: ICourse[]): ICalendarItem_Teacher[] {
  const calendarTeacherData: ICalendarItem_Teacher[] = [];
  data.forEach((course: ICourse) => {
    const calendarItem: ICalendarItem_Teacher = {
      id: course.professors[0].id,
      teacherName: course.professors[0].username,
      courseId: course.CourseID.subject + course.CourseID.code,
      term: course.CourseID.term,
      color: colors[course.professors[0].id % colors.length],
      link: '/professor-profile/' + course.professors[0].username
    };
    calendarTeacherData.push(calendarItem);
  });
  return calendarTeacherData;
}

export function parseCalendarCourse(data: ICourse[], courseId?: string, professorId?: number): ICalendarCourseItem[] {
  const calendarCourseData: ICalendarCourseItem[] = [];
  let courseProp = courseId ? courseId : undefined;
  let professorProp = professorId ? professorId : undefined;

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
        courseId: course.CourseID.subject + course.CourseID.code,
        teacherId: course.professors[0].id,
        startDate: courseStartDate,
        endDate: courseEndDate,

        // *****important: only repeat the current day. For exmaple, csc105 should repeat on Tus, Wed, Fri.
        // If you double click that course shown on Tuesday, and choose 'Edit series', it will show repate on Tus.
        // And if you click same course on Wednesday, it will show repeat on Wed.
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=' + element.Day.slice(0, 2) + ';UNTIL=' + course.endDate.replaceAll('-', '')
      };

      // Conditional return rules based on props
      if (professorProp && courseProp) {
        console.log('Have professor and course props', professorProp, courseProp);
        if (calendarItem.teacherId === professorProp && courseProp === calendarItem.courseId) {
          calendarCourseData.push(calendarItem);
        }
      } else if (courseProp && !professorProp) {
        console.log('Have course props', professorProp, courseProp);
        if (calendarItem.courseId === courseProp) {
          calendarCourseData.push(calendarItem);
        }
      } else if (!courseProp && professorProp) {
        console.log('Have professor props', professorProp, courseProp);
        if (calendarItem.teacherId === professorProp) {
          calendarCourseData.push(calendarItem);
        }
      } else {
        console.log('No props', professorProp, courseProp);
        calendarCourseData.push(calendarItem);
      }
    });
  });
  return calendarCourseData;
}

export function getTeacherById(id: number) {
  const data: ICalendarItem_Teacher[] = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));
  return Query(data).filter(['id', id]).toArray()[0];
}

// Given a data source and a professor username, return courses that professor is teaching or has taught.
export function getCoursesForProfessor(username: string, data: ICourse[]): ICourse[] {
  const today = new Date();
  const courses: ICourse[] = [];
  data.forEach((course: ICourse) => {
    course.professors.forEach((professor) => {
      if (professor.username === username) {
        if (new Date(course.startDate) <= today && new Date(course.endDate) >= today) {
          courses.push(course);
        }
      }
    });
  });
  return courses;
}
