import { gql } from '@apollo/client';

/**
 * Get the currently logged in user's information
 */
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

/**
 * Gets a user by an id (int)
 */
export const GET_USER_BY_ID = gql`
  query FindUserById($id: Int!) {
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

/**
 * Fetch complete list of users for professors list component
 */
export const GET_PROFESSORS = gql`
  query AllUsers {
    allUsers {
      id
      username
      name
      password
      role
      preferences {
        id {
          subject
          title
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

/**
 * Gets the survey for the current user.
 */
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

/**
 * Fetch a list of courses for a given term and year
 */
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

/**
 * Fetch the schedule for a given year.
 */
export const GET_SCHEDULE = gql`
  query Query($year: Int) {
    schedule(year: $year)
  }
`;
