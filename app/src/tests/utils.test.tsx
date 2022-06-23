import { parseCalendarCourse } from 'utils/utils';

test('Test parseCalendarCourse', () => {
  const testData = [
    {
      CourseID: { subject: 'CSC', code: '105', term: 'SPRING' },
      hoursPerWeek: 3,
      capacity: 150,
      professors: [
        {
          id: 3402,
          username: 'olgagould',
          password: null,
          role: 'USER',
          preferences: { id: { subject: 'CSC', code: '105', term: 'SPRING' }, preference: 130 },
          active: true
        }
      ],
      startDate: '2022-01-10',
      endDate: '2022-04-07',
      meetingTimes: [
        { Day: 'TUESDAY', StartTime: '08:30:00', EndTime: '09:20:00' },
        { Day: 'WEDNESDAY', StartTime: '08:30:00', EndTime: '09:20:00' },
        { Day: 'FRIDAY', StartTime: '08:30:00', EndTime: '09:20:00' }
      ]
    }
  ];

  // new Date('2022-01-10') is 2022-01-09
  const startDate = new Date('2022-01-10');
  const endDate = new Date('2022-01-10');
  startDate.setHours(8);
  startDate.setMinutes(30);
  endDate.setHours(9);
  endDate.setMinutes(20);
  const expected = [
    {
      courseId: 'CSC105',
      teacherId: 3402,
      text: 'CSC105',
      startDate: startDate,
      endDate: endDate,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20220407'
    },
    {
      courseId: 'CSC105',
      teacherId: 3402,
      text: 'CSC105',
      startDate: startDate,
      endDate: endDate,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;UNTIL=20220407'
    },
    {
      courseId: 'CSC105',
      teacherId: 3402,
      text: 'CSC105',
      startDate: startDate,
      endDate: endDate,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=FR;UNTIL=20220407'
    }
  ];

  const res = parseCalendarCourse(JSON.parse(JSON.stringify(testData)));

  expect(res).toEqual(expected);
});

export { };
