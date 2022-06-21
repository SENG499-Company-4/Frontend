import { ICalendarItem_Course, ICourse, ICalendarItem_Teacher } from 'components/shared/interfaces/timetable.interfaces';
import colors from 'data/CourseColor.json';

/**
 * Grab data from python scraper and format it for DevExtreme Scheduler
 *  Reference: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/CustomTemplates/React/Light/
 */

export function parseCalendarJSON_Teacher(data: ICourse[]): ICalendarItem_Teacher[] {
  const calendarData_Teacher: ICalendarItem_Teacher[] = [];
  data.forEach((course: ICourse) => {
    const calendarItem: ICalendarItem_Teacher = {
      id: course.professors[0].id,
      teacherName: course.professors[0].username,
      color: colors[course.professors[0].id % colors.length],
    };
    calendarData_Teacher.push(calendarItem);
  });
  // console.log("Teacher", calendarData_Teacher);
  return calendarData_Teacher;
}


export function parseCalendarJSON_Course(data: ICourse[]): ICalendarItem_Course[] {
  const calendarData_Course: ICalendarItem_Course[] = [];
  data.forEach((course: ICourse) => {
    course.meetingTimes.forEach((element) => {
      //each meeting maps to a calendar item ex: csc105 has three calendar items: Tus, Wed, Fri.
      const courseStartDate = new Date(course.startDate);
      const courseEndDate = new Date(course.startDate);

      courseStartDate.setHours(parseInt(element.StartTime.split(':')[0]));
      courseStartDate.setMinutes(parseInt(element.StartTime.split(':')[1]));

      courseEndDate.setHours(parseInt(element.EndTime.split(':')[0]));
      courseEndDate.setMinutes(parseInt(element.EndTime.split(':')[1]));

      const calendarItem: ICalendarItem_Course = {
        courseId: course.CourseID.subject + course.CourseID.code,
        teacherId: course.professors[0].id,
        startDate: courseStartDate,
        endDate: courseEndDate,

        // *****important: only repeat the current day. For exmaple, csc105 should repeat on Tus, Wed, Fri.
        // If you double click that course shown on Tuesday, and choose 'Edit series', it will show repate on Tus.
        // And if you click same course on Wednesday, it will show repeat on Wed.
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=' + element.Day.slice(0, 2) + ';UNTIL=' + course.endDate.replaceAll('-', '')
      };
      calendarData_Course.push(calendarItem);
    });
  });
  // console.log("Calendar", calendarData_Course);
  return calendarData_Course;
}
