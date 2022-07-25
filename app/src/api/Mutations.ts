import { gql } from '@apollo/client';

/**
 * Log in a user
 */
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      success
      token
      message
    }
  }
`;

/**
 * Log out a user
 */
export const LOGOUT = gql`
  mutation Mutation {
    logout {
      success
      token
      message
    }
  }
`;

/**
 * Create a new user
 */
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

/**
 * Update a user
 */
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

/**
 * Change a user password
 */
export const CHANGE_USER_PASSWORD = gql`
  mutation Mutation($input: ChangeUserPasswordInput!) {
    changeUserPassword(input: $input) {
      success
      message
    }
  }
`;

/**
 * Reset a user's password
 */
export const RESET_PASSWORD = gql`
  mutation Mutation($resetPasswordId: ID!) {
    resetPassword(id: $resetPasswordId) {
      success
      message
      password
    }
  }
`;

/**
 * Submit a survey
 */
export const SUBMIT_SURVEY = gql`
  mutation CreateTeachingPreference($input: CreateTeachingPreferenceInput!) {
    createTeachingPreference(input: $input) {
      success
      message
    }
  }
`;

/**
 * Generate a schedule
 */
export const GENERATE_SCHEDULE = gql`
  mutation Mutation($input: GenerateScheduleInput!) {
    generateSchedule(input: $input) {
      success
      message
    }
  }
`;

/**
 * Update a schedule
 */
export const UPDATE_SCHEDULE = gql`
  mutation Mutation($input: UpdateScheduleInput!) {
    updateSchedule(input: $input) {
      success
      message
      errors
    }
  }
`;
