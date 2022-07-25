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
      role
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
 * Fetch the schedule for a given year.
 */
export const GET_SCHEDULE = gql`
  query Schedule($year: Int, $term: Term!) {
    schedule(year: $year) {
      courses(term: $term) {
        CourseID {
          subject
          title
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
          active
        }
        startDate
        endDate
        sectionNumber
        meetingTimes {
          day
          startTime
          endTime
        }
      }
    }
  }
`;
