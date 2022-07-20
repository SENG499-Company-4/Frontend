import {
  ICalendarCourseItem,
  ICourse,
  ICalendarItem_Teacher,
  IScheduleListItem
} from 'interfaces/timetable.interfaces';
import colors from 'data/CourseColor.json';
import Query from 'devextreme/data/query';
import classData from 'data/clean.json';

function daytoInt(day: string) {
  return ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(day);
}



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
      link: '/professors/' + course.professors[0].id
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

      const dayshift = daytoInt(element.Day)

      const courseStartDate = new Date(course.startDate + ' 00:00');
      const courseEndDate = new Date(course.startDate + ' 00:00');

      if (courseStartDate.getDay() > dayshift) {
        courseStartDate.setDate(parseInt(course.startDate.split('-')[2]) + dayshift + courseStartDate.getDay() + 1);
        courseEndDate.setDate(parseInt(course.startDate.split('-')[2]) + dayshift + courseEndDate.getDay() + 1);
      } else {
        courseStartDate.setDate(parseInt(course.startDate.split('-')[2]) + dayshift - courseStartDate.getDay());
        courseEndDate.setDate(parseInt(course.startDate.split('-')[2]) + dayshift - courseEndDate.getDay());
      }
      courseStartDate.setHours(parseInt(element.StartTime.split(':')[0]));
      courseStartDate.setMinutes(parseInt(element.StartTime.split(':')[1]));

      courseEndDate.setHours(parseInt(element.EndTime.split(':')[0]));
      courseEndDate.setMinutes(parseInt(element.EndTime.split(':')[1]));

      console.log(courseStartDate)
      const lastDay = new Date(course.endDate + ' 00:00');

      if (lastDay.getDay() >= dayshift) {
        lastDay.setDate(parseInt(course.endDate.split('-')[2]) - (lastDay.getDay() - dayshift));
      }

      const calendarItem: ICalendarCourseItem = {
        courseId: course.CourseID.subject + course.CourseID.code,
        teacherId: course.professors[0].id,
        startDate: courseStartDate,
        endDate: courseEndDate,
        lastDay: lastDay
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

export function parseScheduleListItems(data: ICourse[]): IScheduleListItem[] {
  const scheduleListItemData: IScheduleListItem[] = [];
  data.forEach((course: ICourse) => {
    const daysOfWeek: string[] = [];
    course.meetingTimes.forEach((element) => {
      if (element.Day === 'THURSDAY') {
        daysOfWeek.push('R');
      } else {
        daysOfWeek.push(element.Day.slice(0, 1));
      }
    });
    const scheduleListItem: IScheduleListItem = {
      courseNumber: course.CourseID.code,
      title: course.CourseID.subject + course.CourseID.code,
      professors: course.professors,
      startDate: course.startDate,
      endDate: course.endDate,
      timeOfDay: course.meetingTimes[0].StartTime + ' - ' + course.meetingTimes[0].EndTime,
      daysOffered: daysOfWeek,
      capacity: course.capacity
    };
    scheduleListItemData.push(scheduleListItem);
  });
  return scheduleListItemData;
}

export function getTeacherById(id: number) {
  const data: ICalendarItem_Teacher[] = parseCalendarTeacher(JSON.parse(JSON.stringify(classData)));
  return Query(data).filter(['id', id]).toArray()[0];
}

// Given a data source and a professor username, return courses that professor is teaching or has taught.
export function getCoursesForProfessor(id?: number, data?: ICourse[]): ICourse[] {
  if (!id || !data) {
    return [];
  }
  const today = new Date();
  const courses: ICourse[] = [];
  data.forEach((course: ICourse) => {
    course.professors.forEach((professor) => {
      if (professor.id === id) {
        if (new Date(course.startDate) <= today && new Date(course.endDate) >= today) {
          courses.push(course);
        }
      }
    });
  });
  return courses;
}
