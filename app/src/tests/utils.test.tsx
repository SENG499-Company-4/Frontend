import { parseCalendarJSON } from 'utils/utils';

test('Test parseCalendarJSON', () => {

  const testData = [
    {
      "CourseID": { "subject": "CSC", "code": "105", "term": "SPRING" },
      "hoursPerWeek": 3,
      "capacity": 150,
      "professors": [
        {
          "id": 3402,
          "username": "olgagould",
          "password": null,
          "role": "USER",
          "preferences": { "id": { "subject": "CSC", "code": "105", "term": "SPRING" }, "preference": 130 },
          "active": true
        }
      ],
      "startDate": "2022-01-10",
      "endDate": "2022-04-07",
      "meetingTimes": [
        { "Day": "TUESDAY", "StartTime": "08:30:00", "EndTime": "09:20:00" },
        { "Day": "WEDNESDAY", "StartTime": "08:30:00", "EndTime": "09:20:00" },
        { "Day": "FRIDAY", "StartTime": "08:30:00", "EndTime": "09:20:00" }
      ]
    }
  ]

  const startDate = new Date('2022-01-10T08:30:00.000Z');
  const endDate = new Date('2022-01-10T09:20:00.000Z');
  const expected = [
    {
      courseId: 'CSC105',
      teacherId: 3402,
      text: 'CSC105',
      startDate: startDate,
      endDate: endDate,
      teacherName: 'olgagould',
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20220407'
    },
    {
      courseId: 'CSC105',
      teacherId: 3402,
      text: 'CSC105',
      startDate: startDate,
      endDate: endDate,
      teacherName: 'olgagould',
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;UNTIL=20220407'
    },
    {
      courseId: 'CSC105',
      teacherId: 3402,
      text: 'CSC105',
      startDate: startDate,
      endDate: endDate,
      teacherName: 'olgagould',
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=FR;UNTIL=20220407'
    }
  ];

  const res = parseCalendarJSON(JSON.parse(JSON.stringify(testData)));

  expect(res).toEqual(expected);

})

export { };
