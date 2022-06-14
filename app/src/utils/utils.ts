import { ICalendarItem, ICourse } from 'components/shared/interfaces/timetable.interfaces';

/**
 * Grab data from python scraper and format it for DevExtreme Scheduler
 *  Reference: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/CustomTemplates/React/Light/
 */
export function parseCalendarJSON(data: ICourse[]): ICalendarItem[] {
  const calendarData: ICalendarItem[] = [];
  data.forEach((course: ICourse) => {
    course.meetingTimes.forEach((element) => {
      //each meeting maps to a calendar item ex: csc105 has three calendar items: Tus, Wed, Fri.
      const courseStartDate = new Date(course.startDate);
      const courseEndDate = new Date(course.startDate);

      courseStartDate.setHours(parseInt(element.StartTime.split(':')[0]));
      courseStartDate.setMinutes(parseInt(element.StartTime.split(':')[1]));

      courseEndDate.setHours(parseInt(element.EndTime.split(':')[0]));
      courseEndDate.setMinutes(parseInt(element.EndTime.split(':')[1]));

      const calendarItem: ICalendarItem = {
        courseId: course.CourseID.subject + course.CourseID.code,
        teacherId: course.professors[0].id,
        text: course.CourseID.subject + course.CourseID.code,
        startDate: courseStartDate,
        endDate: courseEndDate,
        teacherName: course.professors[0].username,

        // *****important: only repeat the current day. For exmaple, csc105 should repeat on Tus, Wed, Fri.
        // If you double click that course shown on Tuesday, and choose 'Edit series', it will show repate on Tus.
        // And if you click same course on Wednesday, it will show repeat on Wed.
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=' + element.Day.slice(0, 2) + ';UNTIL=' + course.endDate.replaceAll('-', '')
      };
      calendarData.push(calendarItem);
    });
  });
  console.log(calendarData);
  return calendarData;
}
