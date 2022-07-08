import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
      message
    }
  }
`;

export const LOGOUT = gql`
  mutation Mutation {
    logout {
      success
      token
      message
    }
  }
`;

export const CREATE_USER = gql`
  mutation Mutation($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      message
      username
      password
    }
  }
`;

export const UPDATE_USER = gql`
  mutation Mutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
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
      errors {
        message
      }
    }
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  mutation Mutation($input: ChangeUserPasswordInput!) {
    changeUserPassword(input: $input) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation Mutation($resetPasswordId: ID!) {
    resetPassword(id: $resetPasswordId) {
      success
      message
      password
    }
  }
`;

export const SUBMIT_SURVEY = gql`
  mutation CreateTeachingPreference($peng: Boolean, $userId: ID, $courses: [CoursePreferenceInput]!) {
    createTeachingPreference(peng: $peng, userId: $userId, courses: $courses) {
      peng
      userId
      courses
    }
  }
`;

export const GENERATE_SCHEDULE = gql`
  mutation Mutation($input: GenerateScheduleInput!) {
    generateSchedule(input: $input) {
      success
      message
    }
  }
`;
