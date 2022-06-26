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
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GENERATE_SCHEDULE } from 'components/shared/api/Mutations';
import LoadingSpinner from 'components/organisms/LoadingSpinner';
import ErrorPage from './ErrorPage';
import ClassData from 'data/clean.json';
import { allTopics } from 'components/shared/constants/surveyForm.constants';

function ScheduleGenerate() {
  const [term, setTerm] = useState<string>('Spring');
  const [year, setYear] = useState<number>(2022);
  const [classes, setClasses] = useState<string[]>([]);
  const [riskAck, setRiskAck] = useState<boolean>(false);

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
    console.log(data);
    console.log(classes);
    return (
      <Dialog
        open={true}
        keepMounted
        onClose={() => (window.location.href = '/schedule/generate')}
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
          <Button onClick={() => (window.location.href = '/schedule/generate')}>Ok</Button>
        </DialogActions>
      </Dialog>
    );
    window.location.href = '/schedule/generate';
  } else if (loading) {
    return <LoadingSpinner />;
  } else if (error) {
    console.log(error);
    return <ErrorPage code={'400'} message="Schedule generation failed. Please try again." />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom marginY={4} textAlign={'center'}>
        Generate a New Schedule
      </Typography>
      <Box>
        <form>
          <Box sx={{ width: '60%', marginLeft: '20%' }}>
            <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}>
              <FormControl>
                <FormLabel sx={{ marginTop: '10px' }}>Select a year:</FormLabel>
                <RadioGroup row aria-labelledby="Year" name="row-radio-buttons-group">
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
                <RadioGroup row aria-labelledby="Term" name="row-radio-buttons-group">
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
              <Button
                variant="contained"
                color="primary"
                disabled={!riskAck}
                type="submit"
                sx={{ float: 'right' }}
                onClick={() =>
                  submitHandler({
                    variables: {
                      input: {
                        year: year
                      }
                    }
                  })
                }
              >
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
