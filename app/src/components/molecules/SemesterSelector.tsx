import { DatePicker, LocalizationProvider } from '@mui/lab';
import { Grid, MenuItem, TextField } from '@mui/material';
import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Term } from 'types/api.types';

interface SemesterSelectorProps {
  term?: Term;
  year?: Date;
  onTermChange: (term: Term) => void;
  onYearChange: (year: Date) => void;
}

export function SemesterSelector(props: SemesterSelectorProps): React.ReactElement {
  const termOptions = [Term.Fall, Term.Summer, Term.Spring];
  const [term, setTerm] = useState<Term | undefined>(props.term || undefined);
  const [year, setYear] = useState<Date | undefined>(props.year || undefined);

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item>
        <TextField
          id="select-term"
          select
          label="Select Term"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value as Term);
            props.onTermChange(e.target.value as Term);
          }}
          style={{ width: '300px' }}
        >
          {termOptions.map((termItem: Term) => (
            <MenuItem key={termItem} value={termItem}>
              {termItem}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={['year']}
            label="Select Year"
            value={year}
            minDate={new Date(2020, 0, 1)}
            maxDate={new Date(2024, 0, 1)}
            onChange={(e) => {
              console.log('e: ', e);
              setYear(e);
              props.onYearChange(e as Date);
            }}
            renderInput={(params) => <TextField {...params} helperText={undefined} />}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
}
