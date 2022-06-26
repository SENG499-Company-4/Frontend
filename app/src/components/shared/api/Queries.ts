import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
    me {
      id
      username
      name
      password
      role
      preferences {
        id {
          subject
          code
          term
          year
        }
        preference
      }
      active
    }
  }
`;

export const GET_USER = gql`
  query FindUserById($id: Int) {
    findUserById(id: $id) {
      id
      username
      name
      password
      role
      preferences {
        id {
          subject
          code
          term
          year
        }
        preference
      }
      active
    }
  }
`;

export const GET_SURVEY = gql`
  query Survey {
    survey {
      courses {
        id {
          subject
          code
          term
          year
        }
        preference
      }
    }
  }
`;

export const GET_COURSES = gql`
  query Courses($term: Term, $year: Int) {
    courses(term: $term, year: $year) {
      CourseID {
        subject
        code
        term
        year
      }
      hoursPerWeek
      capacity
      professors {
        id
        username
        name
        password
        role
        preferences {
          id {
            subject
            code
            term
            year
          }
          preference
        }
        active
      }
      startDate
      endDate
      meetingTimes {
        day
        startTime
        endTime
      }
    }
  }
`;

export const GET_SCHEDULE = gql`
  query Query($year: Int) {
    schedule(year: $year)
  }
`;
