import LoadingSpinner from 'components/organisms/LoadingSpinner';
import * as React from 'react';
import { useState } from 'react';

interface ILoadingContextProps {
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

export const LoadingContextProvider: React.FC<ILoadingContextProps> = (props: ILoadingContextProps) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading
      }}
    >
      <LoadingSpinner isLoading={isLoading} />
      {props.children}
    </LoadingContext.Provider>
  );
};
