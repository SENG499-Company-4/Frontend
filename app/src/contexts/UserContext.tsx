import { Role } from 'components/shared/constants/timetable.constants';
import * as React from 'react';
import { useState } from 'react';

interface IUserContextProps {
  children?: React.ReactNode;
}

interface IUser {
  username: string;
  role: Role;
  jwt?: string;
}

export interface IUserState {
  user: IUser;
  setUser: (user: IUser) => void;
}

export const UserContext = React.createContext<IUserState>({
  user: {
    username: '',
    role: Role.User,
    jwt: ''
  },
  setUser: (user: IUser) => {
    console.log('User: ', user);
  }
});

export const UserContextProvider: React.FC<IUserContextProps> = (props: IUserContextProps) => {
  const [user, setUser] = useState<IUser>({
    username: '',
    role: Role.User
  });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
