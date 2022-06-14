import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

interface ITermOptionProps {
  label: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, term: string) => void;
  term: string;
  prefs: string;
}

export default function TermOptions(props: ITermOptionProps) {
  return (
    <>
      <FormControl>
        <InputLabel id="select-role-label">{props.label}</InputLabel>
        <Select
          labelId="select-role-label"
          label={props.label}
          id="select-role"
          value={props.prefs}
          onChange={(event) => props.handleChange(event as React.ChangeEvent<HTMLInputElement>, props.term)}
          sx={{ width: '150px' }}
        >
          <MenuItem value={'Teaching'}>Teaching</MenuItem>
          <MenuItem value={'Research'}>Research</MenuItem>
          <MenuItem value={'HalfLeave'}>Half Leave</MenuItem>
          <MenuItem value={'FullLeave'}>Full Leave</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
