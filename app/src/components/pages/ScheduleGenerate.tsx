import {
  Autocomplete,
  Stack,
  TextField,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { GENERATE_SCHEDULE } from 'components/shared/api/Mutations';
import ClassData from 'data/clean.json';
import { allTopics } from 'components/shared/constants/surveyForm.constants';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';

function ScheduleGenerate() {
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  const [term, setTerm] = useState<string>('Spring');
  const [year, setYear] = useState<number>(2022);
  const [classes, setClasses] = useState<string[]>([]);
  const [riskAck, setRiskAck] = useState<boolean>(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);

  const uniqueClassList = Array.from(
    new Set(
      ClassData.map((course) => {
        const trimmed = course.CourseID.code.replace(/\D/g, ''); //trim all non-numeric characters
        const code = allTopics[course.CourseID.subject].includes(trimmed) //if course code is a topics course remove its letter
          ? trimmed
          : course.CourseID.code;
        return JSON.stringify(course.CourseID.subject + ' ' + code);
      })
    ),
    (s) => JSON.parse(s)
  );

  const [submitHandler, { data, loading, error }] = useMutation(GENERATE_SCHEDULE);

  if (data) {
    console.log('DATA: ', data);
  }

  useEffect(() => {
    loadingContext.setLoading(loading);
    if (data) {
      setSuccessDialogOpen(true);
    }
    if (error) {
      errorContext.setErrorDialog({
        code: error.graphQLErrors[0].extensions.code,
        message: 'Schedule generation failed. Please try again.' + error.graphQLErrors[0].message,
        namespace: 'graphql'
      });
    }
  }, [data, loading, error]);

  function submit() {
    console.log('Creating schedule with classes: ', classes);
    submitHandler({
      variables: {
        input: {
          year: year
        }
      }
    });
  }

  return (
    <Box>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false);
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Submission Successful'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Your generation request was submitted successfully. When the scheduling algorithm completes, you'll be able
            to view the schedule on the management page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSuccessDialogOpen(false);
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4" gutterBottom marginY={4} textAlign={'center'}>
        Generate a New Schedule
      </Typography>
      <Box>
        <form>
          <Box sx={{ width: '60%', marginLeft: '20%' }}>
            <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}>
              <FormControl>
                <FormLabel sx={{ marginTop: '10px' }}>Select a year:</FormLabel>
                <RadioGroup row aria-labelledby="Year">
                  <FormControlLabel
                    onChange={() => setYear(2022)}
                    checked={year === 2022}
                    control={<Radio />}
                    label="2022"
                  />
                  <FormControlLabel
                    onChange={() => setYear(2023)}
                    checked={year === 2023}
                    control={<Radio />}
                    label="2023"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}>
              <FormControl>
                <FormLabel sx={{ marginTop: '10px' }}>Select a semester:</FormLabel>
                <RadioGroup row aria-labelledby="Term">
                  <FormControlLabel
                    onChange={() => setTerm('Spring')}
                    checked={term === 'Spring'}
                    control={<Radio />}
                    label="Spring"
                  />
                  <FormControlLabel
                    onChange={() => setTerm('Summer')}
                    checked={term === 'Summer'}
                    control={<Radio />}
                    label="Summer"
                  />
                  <FormControlLabel
                    onChange={() => setTerm('Fall')}
                    checked={term === 'Fall'}
                    control={<Radio />}
                    label="Fall"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                id="tags-outlined"
                options={uniqueClassList}
                getOptionLabel={(option) => option}
                sx={{ width: '100%' }}
                onChange={(event, value) => {
                  event.preventDefault();
                  setClasses(value);
                }}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} label="Courses" placeholder="Courses to be offered" />}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ float: 'right', marginBottom: '20px' }}>
              <Box>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox onChange={(e) => setRiskAck(e.target.checked)} />}
                    label={
                      <Typography sx={{ fontSize: 15, fontStyle: 'italic' }}>
                        I acknowledge that generating a new schedule for this term will overwrite any existing schedules
                        for this term.
                      </Typography>
                    }
                    labelPlacement="start"
                  />
                </FormGroup>
              </Box>
              <Button variant="contained" color="primary" disabled={!riskAck} sx={{ float: 'right' }} onClick={submit}>
                Submit
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default ScheduleGenerate;
