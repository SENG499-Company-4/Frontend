import { Autocomplete, Stack, TextField, Box, Typography, Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, FormGroup, Checkbox } from '@mui/material';
import React, { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import ClassData from 'data/clean.json';
import { allTopics } from 'components/shared/constants/surveyForm.constants';

function ScheduleGenerate() {
  const [term, setTerm] = useState<string>("Spring");
  const [year, setYear] = useState<number>(2022);
  const [classes, setClasses] = useState<string[]>([]);
  const [riskAck, setRiskAck] = useState<boolean>(false);

  let navigate: NavigateFunction = useNavigate();

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const output = {
      term: term,
      classes: classes
    };
    console.log(output);
    e.preventDefault();
    navigate("/schedule");
    //TODO: submit values somewhere
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom marginY={4} textAlign={'center'}>
        Generate a New Schedule
      </Typography>
      <Box>
        <form onSubmit={onSubmit}>
          <Box sx={{ width: '60%', marginLeft: '20%'}}>
            <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}> 
              <FormControl>
                <FormLabel sx={{ marginTop: '10px' }}>
                  Select a year:
                </FormLabel>
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
                <FormLabel sx={{ marginTop: '10px' }}>
                  Select a semester:
                </FormLabel>
                <RadioGroup row aria-labelledby="Term" name="row-radio-buttons-group">
                  <FormControlLabel
                    onChange={() => setTerm("Spring")}
                    checked={term === "Spring"}
                    control={<Radio />}
                    label="Spring"
                  />
                  <FormControlLabel
                    onChange={() => setTerm("Summer")}
                    checked={term === "Summer"}
                    control={<Radio />}
                    label="Summer"
                  />
                  <FormControlLabel
                    onChange={() => setTerm("Fall")}
                    checked={term === "Fall"}
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
                    label={<Typography sx={{ fontSize: 15, fontStyle: 'italic' }}>I acknowledge that generating a new schedule for this term will overwrite any existing schedules for this term.</Typography>}
                    labelPlacement="start"
                  />
                </FormGroup>
              </Box>
              <Button variant="contained" color="primary" disabled={!riskAck} type="submit" sx={{ float: 'right' }}>
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
