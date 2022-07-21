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
  DialogActions,
  Paper,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Chip
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { GENERATE_SCHEDULE } from 'api/Mutations';
import { fallCodes, springCodes, summerCodes, courseCodes } from 'constants/courses.constants';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { ISections, ITermSelection } from 'interfaces/scheduleGenerate.interfaces';
import { CourseInput } from 'types/api.types';

function ScheduleGenerate() {
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  const [term, setTerm] = useState<string>(ITermSelection.All);
  const [year, setYear] = useState<number>(2021);
  const [classes, setClasses] = useState<string[]>([]);
  const [riskAck, setRiskAck] = useState<boolean>(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [sections, setSections] = useState<ISections>({});
  const [values, setValues] = React.useState<string[]>([]);

  const uniqueClassList = Array.from(
    new Set(
      courseCodes.map((course) => {
        const courseSplit = course.split(/([0-9]+)/);
        return courseSplit[0] + ' ' + courseSplit[1];
      })
    )
  );

  const [generateSchedule, { data, loading, error }] = useMutation(GENERATE_SCHEDULE);

  useEffect(() => {
    loadingContext.setLoading(loading);
    if (data) {
      setSuccessDialogOpen(true);
      console.log('Schedule generate data: ', data);
    }
    if (error) {
      const errorCode = error.graphQLErrors.length > 0 ? error.graphQLErrors[0].extensions.code : 400;
      const errorMessage = error.graphQLErrors.length > 0 ? error.graphQLErrors[0].message : '';
      errorContext.setErrorDialog({
        code: errorCode,
        message: 'Schedule generation failed. Please try again.' + errorMessage,
        namespace: 'graphql'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, error]);

  function addAll() {
    setClasses(uniqueClassList);
    let tempSections: ISections = {};
    for (const code of uniqueClassList) {
      tempSections[code] = 0;
    }
    setSections(tempSections);
  }

  function removeAll() {
    setClasses([]);
    setSections({});
    setValues([]);
  }

  function splitYearly(variables: any) {
    let fallCourses = [];
    let springCourses = [];
    let summerCourses = [];
    for (const index in classes) {
      const courseCode = classes[index];
      let sectionCount = sections[courseCode];
      const inFall = fallCodes.includes(courseCode.replace(/ /g, ''));
      const inSpring = springCodes.includes(courseCode.replace(/ /g, ''));
      const inSummer = summerCodes.includes(courseCode.replace(/ /g, ''));
      const totalSemesters = Number(inFall) + Number(inSpring) + Number(inSummer);
      if (inFall) {
        const fallSections = Math.ceil(sectionCount / totalSemesters);
        sectionCount -= fallSections;
        fallCourses.push({
          subject: courseCode.split(' ')[0],
          code: courseCode.split(' ')[1],
          section: fallSections
        });
      }
      if (inSpring) {
        const springSections = Math.ceil(sectionCount / totalSemesters);
        sectionCount -= springSections;
        springCourses.push({
          subject: courseCode.split(' ')[0],
          code: courseCode.split(' ')[1],
          section: springSections
        });
      }
      if (inSummer) {
        const summerSections = Math.ceil(sectionCount / totalSemesters);
        sectionCount -= summerSections;
        summerCourses.push({
          subject: courseCode.split(' ')[0],
          code: courseCode.split(' ')[1],
          section: summerSections
        });
      }
    }
    variables.input['fallCourses'] = fallCourses;
    variables.input['springCourses'] = springCourses;
    variables.input['summerCourses'] = summerCourses;
    return variables;
  }

  function splitCourses(variables: any) {
    if (term === ITermSelection.All) {
      return splitYearly(variables);
    }
    const courses: CourseInput[] = classes.map((classInfo) => {
      return {
        subject: classInfo.split(' ')[0],
        code: classInfo.split(' ')[1],
        section: sections[classInfo]
      };
    });
    if (term === ITermSelection.Fall) variables.input['fallCourses'] = courses;
    else if (term === ITermSelection.Spring) variables.input['springCourses'] = courses;
    else variables.input['summerCourses'] = courses;
    return variables;
  }

  function submit() {
    const config = {
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${process.env.REACT_APP_HEROKU}`
      }
    };
    axios.get(`https://api.heroku.com/apps/seng499company4frontend/config-vars`, config).then((res) => {
      const configVars = res.data;
      let variables = {
        input: {
          year: year,
          algorithm1: configVars.REACT_APP_ALGORITHM_1.toUpperCase(),
          algorithm2: configVars.REACT_APP_ALGORITHM_2.toUpperCase()
        }
      };
      variables = splitCourses(variables);

      console.log('Sending request to schedule generate... ', variables);
      generateSchedule({ variables });
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
              window.location.reload();
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
                    onChange={() => setYear(2021)}
                    checked={year === 2021}
                    control={<Radio />}
                    label="2021"
                  />
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
                  <FormControlLabel
                    onChange={() => setYear(2024)}
                    checked={year === 2024}
                    control={<Radio />}
                    label="2024"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}>
              <FormControl>
                <FormLabel sx={{ marginTop: '10px' }}>Select a semester:</FormLabel>
                <RadioGroup row aria-labelledby="Term">
                  <FormControlLabel
                    onChange={() => setTerm(ITermSelection.All)}
                    checked={term === ITermSelection.All}
                    control={<Radio />}
                    label="All (entire year)"
                  />
                  <FormControlLabel
                    onChange={() => setTerm(ITermSelection.Spring)}
                    checked={term === ITermSelection.Spring}
                    control={<Radio />}
                    label="Spring"
                  />
                  <FormControlLabel
                    onChange={() => setTerm(ITermSelection.Summer)}
                    checked={term === ITermSelection.Summer}
                    control={<Radio />}
                    label="Summer"
                  />
                  <FormControlLabel
                    onChange={() => setTerm(ITermSelection.Fall)}
                    checked={term === ITermSelection.Fall}
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
                value={values}
                id="tags-outlined"
                options={uniqueClassList}
                getOptionLabel={(option) => option}
                sx={{ width: '100%' }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                onChange={(event, value, reason, detail) => {
                  event.preventDefault();
                  setClasses(value);
                  setValues(value);
                  if (reason === 'selectOption') {
                    const courseCode = detail?.option;
                    if (courseCode) setSections({ ...sections, [courseCode]: 0 });
                  } else if (reason === 'clear') {
                    setSections({});
                  }
                }}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} label="Courses" placeholder="Courses to be offered" />}
              />
              <Button variant="contained" color="primary" sx={{ width: '120px' }} onClick={() => addAll()}>
                Add all
              </Button>
              <Button variant="contained" color="primary" sx={{ width: '150px' }} onClick={() => removeAll()}>
                Clear all
              </Button>
            </Stack>

            <Stack spacing={1} sx={{ marginBottom: '1%' }}>
              {classes.map((className) => {
                return (
                  <Paper key={className} sx={{ p: '1%' }} elevation={3}>
                    <Grid
                      alignItems="center"
                      justifyContent={'space-between'}
                      container
                      padding={'5px'}
                      paddingLeft={'10px'}
                    >
                      <Grid item>
                        <Typography variant="h6">{className}</Typography>
                      </Grid>

                      <Grid item>
                        <Grid container alignItems="center" justifyContent={'flex-start'} columnSpacing={1}>
                          <Grid item>
                            <FormControl size="small" sx={{ width: '100%' }}>
                              <InputLabel id={className + '-sections-select-label'}>Sections to be Offered</InputLabel>
                              <Select
                                sx={{ width: 'auto', minWidth: '250px' }}
                                labelId={className + '-sections-select-label'}
                                id={className + '-sections-select'}
                                defaultValue={0}
                                label="Sections to be offered: "
                                onChange={(event) => {
                                  setSections({ ...sections, [className]: event.target.value as number });
                                }}
                              >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((amount) => (
                                  <MenuItem key={amount} value={amount}>
                                    {amount !== 0 ? amount : 'Algorithm Determined'}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}
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
