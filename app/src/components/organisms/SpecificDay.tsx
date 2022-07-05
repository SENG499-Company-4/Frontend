import { FormGroup, FormControlLabel, Checkbox, FormControl, InputLabel, MenuItem, Select, Stack, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import { classStartTimes } from "components/shared/constants/Schedule.constants";

function SpecificDay(props: {
  day: string;
  general: boolean;
  defaultValue: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('');

  const handleEnabling = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
    setTime('')
  }

  const handleChange = (event: SelectChangeEvent) => {
    setTime(event.target.value as string);
  };

  return (
    <Stack direction="row">
      <FormGroup >
        <FormControlLabel
          control={<Checkbox />}
          label={props.day}
          sx={{ width: 150 }}
          onChange={(event) => handleEnabling(event as React.ChangeEvent<HTMLInputElement>)}
        />
      </FormGroup>

      <FormControl sx={{ minWidth: "10%" }}>
        <InputLabel id={props.day + '-select-label'}>Start Time</InputLabel>
        <Select
          labelId={props.day + '-select-label'}
          id={props.day + '-select'}
          value={
            enabled
              ? time || props.defaultValue
              : time
          }
          label="Start Time"
          disabled={props.general || !enabled}
          onChange={handleChange}
        >
          {classStartTimes.map((time) => {
            return <MenuItem value={time}>{time}</MenuItem>
          })}
        </Select>
      </FormControl>
    </Stack>
  )

}

export default SpecificDay;