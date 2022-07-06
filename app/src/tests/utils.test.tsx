import { getCoursesForProfessor, parseCalendarCourse } from 'utils/utils';

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
      startDate: startDate,
      endDate: endDate,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20220407'
    },
    {
      courseId: 'CSC105',
      teacherId: 3402,
      startDate: startDate,
      endDate: endDate,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;UNTIL=20220407'
    },
    {
      courseId: 'CSC105',
      teacherId: 3402,
      startDate: startDate,
      endDate: endDate,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=FR;UNTIL=20220407'
    }
  ];

  const res = parseCalendarCourse(JSON.parse(JSON.stringify(testData)));

  expect(res).toEqual(expected);
});

test('Test getCoursesForProfessor', () => {
  const currMonth = new Date().getMonth();
  const currYear = new Date().getFullYear();
  const currDay = new Date().getDate();

  const lastMonth = new Date(currYear, currMonth - 1, currDay).toISOString().slice(0, 10);
  const nextMonth = new Date(currYear, currMonth + 1, currDay).toISOString().slice(0, 10);
  const testData = [
    {
      CourseID: { subject: 'CSC', code: '575', term: 'SPRING' },
      hoursPerWeek: 3,
      capacity: 14,
      professors: [
        {
          id: 1177,
          username: 'gtzan',
          password: null,
          role: 'USER',
          preferences: { id: { subject: 'CSC', code: '575', term: 'SPRING' }, preference: 192 },
          active: true
        }
      ],
      startDate: lastMonth,
      endDate: nextMonth,
      meetingTimes: [
        { Day: 'MONDAY', StartTime: '10:00:00', EndTime: '11:20:00' },
        { Day: 'THURSDAY', StartTime: '10:00:00', EndTime: '11:20:00' }
      ]
    },
    {
      CourseID: { subject: 'CSC', code: '578A', term: 'SPRING' },
      hoursPerWeek: 3,
      capacity: 30,
      professors: [
        {
          id: 9310,
          username: 'bhaworth',
          password: null,
          role: 'USER',
          preferences: { id: { subject: 'CSC', code: '578A', term: 'SPRING' }, preference: 129 },
          active: true
        }
      ],
      startDate: lastMonth,
      endDate: nextMonth,
      meetingTimes: [
        { Day: 'MONDAY', StartTime: '13:00:00', EndTime: '14:20:00' },
        { Day: 'THURSDAY', StartTime: '13:00:00', EndTime: '14:20:00' }
      ]
    }
  ];

  const professorUsername = 'bhaworth';
  const expected = [testData[1]];

  const res = getCoursesForProfessor(professorUsername, JSON.parse(JSON.stringify(testData)));

  expect(res).toEqual(expected);
});

export { };
