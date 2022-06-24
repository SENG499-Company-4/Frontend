import { Autocomplete, Stack, TextField, Box, Typography, Button } from '@mui/material';
import React, { useState } from 'react';
import ClassData from 'data/clean.json';

function ScheduleGenerate() {
  const uniqueClassList = Array.from(
    new Set(ClassData.map(o => JSON.stringify(o.CourseID.subject + " " + o.CourseID.code))),
    s => JSON.parse(s)
  );

  const [fallClasses, setFallClasses] = useState<string[]>([]);
  const [springClasses, setSpringClasses] = useState<string[]>([]);
  const [summerClasses, setSummerClasses] = useState<string[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const output = {
      fall: fallClasses,
      spring: springClasses,
      summer: summerClasses
    }
    console.log(output);
    e.preventDefault();
    //TODO: submit values somewhere
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom marginY={4}>
        Schedule Specific Classes
      </Typography>
      <form onSubmit={onSubmit}>
        <Stack direction="row" spacing={2}>

          <Autocomplete
            multiple
            id="tags-outlined"
            options={uniqueClassList}
            getOptionLabel={(option) => option}
            sx={{ width: "30%" }}
            onChange={(event, value) => {
              event.preventDefault();
              setFallClasses(value);
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Fall"
                placeholder="Fall Courses"

              />
            )}
          />

          <Autocomplete
            multiple
            id="tags-outlined"
            options={uniqueClassList}
            getOptionLabel={(option) => option}
            sx={{ width: "30%" }}
            onChange={(event, value) => {
              event.preventDefault();
              setSpringClasses(value);
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Spring"
                placeholder="Spring Courses"

              />
            )}
          />

          <Autocomplete
            multiple
            id="tags-outlined"
            options={uniqueClassList}
            getOptionLabel={(option) => option}
            sx={{ width: "30%" }}
            onChange={(event, value) => {
              event.preventDefault();
              setSummerClasses(value);
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Summer"
                placeholder="Summer Courses"

              />
            )}
          />
        </Stack>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>

    </Box>
  )
}

export default ScheduleGenerate;
