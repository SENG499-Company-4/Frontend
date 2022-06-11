import * as React from 'react';
import { useState } from 'react';

interface Props {
  children?: React.ReactNode;
}

export interface ILoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoadingContext = React.createContext<ILoadingState>({
  isLoading: false,
  setLoading: (loading: boolean) => {
    console.log('setLoading', loading);
  }
});

export const LoadingContextProvider: React.FC<Props> = (props: Props) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading
      }}
    >
      {props.children}
    </LoadingContext.Provider>
  );
};
