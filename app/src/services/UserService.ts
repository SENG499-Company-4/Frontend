import { CreateUserInput } from 'types/api.types';

export const UserService = () => {
  const getUsers = async () => {
    console.log('getUsers');
  };

  const getUserById = async (id: number) => {
    console.log('getUserById');
  };

  const getMe = async () => {
    console.log('getMe');
  };

  const createUser = async (input: CreateUserInput) => {
    console.log('createUser');
  };

  const updateUser = async (input: CreateUserInput) => {
    console.log('updateUser');
  };

  const changeUserPassword = async (input: CreateUserInput) => {
    console.log('changeUserPassword');
  };

  const resetPassword = async (id: number) => {
    console.log('resetPassword');
  };

  return {
    getUsers,
    getUserById,
    getMe,
    createUser,
    updateUser,
    changeUserPassword,
    resetPassword
  };
};

