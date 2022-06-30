import ErrorDialog from 'components/organisms/ErrorDialog';
import * as React from 'react';
import { useState } from 'react';

export interface IErrorDialog {
  message: string;
  code?: number;
  namespace: string;
}

export interface IErrorState {
  hasErrors: boolean;
  errorDialog: IErrorDialog;
  setErrorDialog: (error: IErrorDialog) => void;
  closeErrorDialog: () => void;
}

export const ErrorContext = React.createContext<IErrorState>({
  hasErrors: false,
  errorDialog: {
    namespace: '',
    message: ''
  },
  setErrorDialog: () => {},
  closeErrorDialog: () => {}
});

export const ErrorContextProvider: React.FC<any> = (props: any) => {
  const [hasErrors, setHasErrors] = useState(false);
  const [errorDialog, setError] = useState<IErrorDialog>({
    namespace: '',
    message: ''
  });

  const setErrorDialog = (error: IErrorDialog) => {
    setHasErrors(true);
    setError(error);
  };

  const closeErrorDialog = () => {
    console.log('Close hit');
    setError({
      namespace: '',
      message: ''
    });
    setHasErrors(false);
  };

  return (
    <>
      {
        <ErrorContext.Provider
          value={{
            hasErrors,
            errorDialog,
            setErrorDialog,
            closeErrorDialog
          }}
        >
          <ErrorDialog open={hasErrors} close={closeErrorDialog} error={errorDialog} />
          {props.children}
        </ErrorContext.Provider>
      }
    </>
  );
};
