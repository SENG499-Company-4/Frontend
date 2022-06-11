import { CalendarItem, Course, Faculty } from "interfaces/interfaces";


/**
 * Grab data from python scraper and format it for DevExtreme Scheduler
 *  Reference: https://js.devexpress.com/Demos/WidgetsGallery/Demo/Scheduler/CustomTemplates/React/Light/
 */
export function parseCalendarJSON(data: Course[]): CalendarItem[] {
    var calendarData: CalendarItem[] = [];
    data.map((course: Course) => {
        course.meetingTimes.forEach((element) => {   //each meeting map to calendar item ex: csc105 has three calendar item: Tus, Wed, Fri. 
            var courseStartDate = new Date(course.startDate);
            var courseEndDate = new Date(course.startDate);
            // switch (element.Day) {
            //     case 'MONDAY': //Caculate next Monday's date
            //         courseStartDate.setDate(courseStartDate.getDate() + (1 + (7 - courseStartDate.getDay())) % 7);
            //         courseEndDate.setDate(courseEndDate.getDate() + (1 + (7 - courseStartDate.getDay())) % 7);
            //         break;
            //     case 'TUESDAY':
            //         courseStartDate.setDate(courseStartDate.getDate() + (2 + (7 - courseStartDate.getDay())) % 7);
            //         courseEndDate.setDate(courseEndDate.getDate() + (2 + (7 - courseStartDate.getDay())) % 7);
            //         break;
            //     case 'WEDNESDAY':
            //         courseStartDate.setDate(courseStartDate.getDate() + (3 + (7 - courseStartDate.getDay())) % 7);
            //         courseEndDate.setDate(courseEndDate.getDate() + (3 + (7 - courseStartDate.getDay())) % 7);
            //         break;
            //     case 'THURSDAY':
            //         courseStartDate.setDate(courseStartDate.getDate() + (4 + (7 - courseStartDate.getDay())) % 7);
            //         courseEndDate.setDate(courseEndDate.getDate() + (4 + (7 - courseStartDate.getDay())) % 7);
            //         break;
            //     case 'FRIDAY':
            //         courseStartDate.setDate(courseStartDate.getDate() + (5 + (7 - courseStartDate.getDay())) % 7);
            //         courseEndDate.setDate(courseEndDate.getDate() + (5 + (7 - courseStartDate.getDay())) % 7);
            //         break;
            //     case 'SATURDAY':
            //         courseStartDate.setDate(courseStartDate.getDate() + (6 + (7 - courseStartDate.getDay())) % 7);
            //         courseEndDate.setDate(courseEndDate.getDate() + (6 + (7 - courseStartDate.getDay())) % 7);
            //         break;
            //     case 'SUNDAY':
            //         courseStartDate.setDate(courseStartDate.getDate() + (0 + (7 - courseStartDate.getDay())) % 7);
            //         courseEndDate.setDate(courseEndDate.getDate() + (0 + (7 - courseStartDate.getDay())) % 7);
            //         break;
            // }


            //Ignore above caculation, the scheduler will caculate the correct date for us.
            courseStartDate.setHours(parseInt(element.StartTime.split(':')[0]));
            courseStartDate.setMinutes(parseInt(element.StartTime.split(':')[1]));

            courseEndDate.setHours(parseInt(element.EndTime.split(':')[0]));
            courseEndDate.setMinutes(parseInt(element.EndTime.split(':')[1]));

            const calendarItem: CalendarItem = {
                courseId: (course.CourseID.subject as Faculty) + course.CourseID.code,
                teacherId: course.professors[0].id, // TODO: Handle multiple professors
                text: (course.CourseID.subject as Faculty) + course.CourseID.code,
                startDate: courseStartDate,
                endDate: courseEndDate,
                teacherName: course.professors[0].username,

                // *****important: only repate the current day. For exmaple, csc105 should repate on Tus, Wed, Fri. 
                // If you double click that course shown on Tuesday, and choose 'Edit series', it will show repate on Tus. 
                // And if you click same course on Wednesday, it will show repate on Wed.
                recurrenceRule: 'FREQ=WEEKLY;BYDAY=' + element.Day.slice(0, 2) + ';UNTIL=' + course.endDate.replaceAll('-', ''),
            };
            calendarData.push(calendarItem);
        });
    });
    console.log(calendarData);
    return calendarData;
}