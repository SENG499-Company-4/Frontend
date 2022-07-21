import { CourseSection } from 'types/api.types';

export type Term = 'SUMMER' | 'WINTER' | 'SPRING';

export type Faculty = 'CSC' | 'SENG' | 'ECE';

export enum Role {
  User = 'USER',
  Admin = 'ADMIN'
}

export type WeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export const TEMP_COURSE_DATA: CourseSection[] = [
  {
    CourseID: {
      subject: 'SENG',
      title: 'Software Development Methods',
      code: '265',
      term: 'FALL',
      year: 0
    },
    hoursPerWeek: 3,
    capacity: 0,
    professors: [
      {
        id: 130,
        username: 'kskipsey',
        name: 'Kate Skipsey',
        password: '$2b$10$tDsA4Ts.DSi4Ry9DoxxQHOS.5ethLRqEFsCO9shyPDefKNaQYXahS',
        role: 'USER',
        preferences: [
          {
            id: {
              subject: 'CHEM',
              title: '',
              code: '101',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'ECON',
              title: '',
              code: '180',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'ECE',
              title: 'Introduction to Computer Architecture',
              code: '255',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Continuous-Time Signals and Systems',
              code: '260',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'ECE',
              title: 'Microprocessor-Based Systems',
              code: '355',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Control Theory and Systems I',
              code: '360',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'ENGR',
              title: '',
              code: '110',
              term: 'FALL',
              year: 2021
            },
            preference: 1
          },
          {
            id: {
              subject: 'ENGR',
              title: '',
              code: '130',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'PHYS',
              title: '',
              code: '110',
              term: 'FALL',
              year: 2021
            },
            preference: 6
          },
          {
            id: {
              subject: 'PHYS',
              title: '',
              code: '111',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'SENG',
              title: 'Software Development Methods',
              code: '265',
              term: 'FALL',
              year: 2021
            },
            preference: 6
          },
          {
            id: {
              subject: 'SENG',
              title: 'Human Computer Interaction',
              code: '310',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          }
        ],
        active: true
      }
    ],
    startDate: '2022-09-05T00:00:00.000Z',
    endDate: '2022-12-05T00:00:00.000Z',
    meetingTimes: [
      {
        day: 'TUESDAY',
        startTime: '1530-01-01T00:00:00.000Z',
        endTime: '1620-01-01T00:00:00.000Z'
      },
      {
        day: 'WEDNESDAY',
        startTime: '1530-01-01T00:00:00.000Z',
        endTime: '1620-01-01T00:00:00.000Z'
      },
      {
        day: 'FRIDAY',
        startTime: '1530-01-01T00:00:00.000Z',
        endTime: '1620-01-01T00:00:00.000Z'
      }
    ],
    sectionNumber: 'A02'
  },
  {
    CourseID: {
      subject: 'SENG',
      title: 'Software Development Methods',
      code: '265',
      term: 'FALL',
      year: 0
    },
    hoursPerWeek: 3,
    capacity: 0,
    professors: [
      {
        id: 99,
        username: 'ilampari',
        name: 'Ilamparithi Thirumarai Chelvan',
        password: '$2b$10$tDsA4Ts.DSi4Ry9DoxxQHOS.5ethLRqEFsCO9shyPDefKNaQYXahS',
        role: 'USER',
        preferences: [
          {
            id: {
              subject: 'CHEM',
              title: '',
              code: '101',
              term: 'FALL',
              year: 2021
            },
            preference: 5
          },
          {
            id: {
              subject: 'ECON',
              title: '',
              code: '180',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'ECE',
              title: 'Introduction to Computer Architecture',
              code: '255',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Continuous-Time Signals and Systems',
              code: '260',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Microprocessor-Based Systems',
              code: '355',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ECE',
              title: 'Control Theory and Systems I',
              code: '360',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ENGR',
              title: '',
              code: '110',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'ENGR',
              title: '',
              code: '130',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'PHYS',
              title: '',
              code: '110',
              term: 'FALL',
              year: 2021
            },
            preference: 2
          },
          {
            id: {
              subject: 'PHYS',
              title: '',
              code: '111',
              term: 'FALL',
              year: 2021
            },
            preference: 4
          },
          {
            id: {
              subject: 'SENG',
              title: 'Software Development Methods',
              code: '265',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          },
          {
            id: {
              subject: 'SENG',
              title: 'Human Computer Interaction',
              code: '310',
              term: 'FALL',
              year: 2021
            },
            preference: 3
          }
        ],
        active: true
      }
    ],
    startDate: '2022-09-05T00:00:00.000Z',
    endDate: '2022-12-05T00:00:00.000Z',
    meetingTimes: [
      {
        day: 'TUESDAY',
        startTime: '1200-01-01T00:00:00.000Z',
        endTime: '1250-01-01T00:00:00.000Z'
      },
      {
        day: 'WEDNESDAY',
        startTime: '1200-01-01T00:00:00.000Z',
        endTime: '1250-01-01T00:00:00.000Z'
      },
      {
        day: 'FRIDAY',
        startTime: '1200-01-01T00:00:00.000Z',
        endTime: '1250-01-01T00:00:00.000Z'
      }
    ],
    sectionNumber: 'A01'
  }
];
