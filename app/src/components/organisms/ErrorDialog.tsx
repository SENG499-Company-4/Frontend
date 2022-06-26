import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { IErrorDialog } from 'contexts/ErrorContext';
import React, { ReactElement } from 'react';

interface ErrorDialogProps {
  error: IErrorDialog;
  open: boolean;
  close: () => void;
}

function ErrorDialog(props: ErrorDialogProps): ReactElement<ErrorDialogProps> {
  console.log('ErrorDialog', props);
  return (
    <Dialog fullWidth={true} maxWidth={'sm'} open={props.open} onClose={props.close}>
      <DialogTitle id="alert-dialog-title">Error{props.error.code ? ' ' + props.error.code : ''}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{props.error.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorDialog;
