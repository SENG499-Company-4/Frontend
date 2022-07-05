import { Typography, Stack, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, SelectChangeEvent, Box, Divider } from "@mui/material";
import { classStartTimes, days } from "components/shared/constants/Schedule.constants";
import React, { useState } from "react";
import SpecificDay from "./SpecificDay";

function SectionTimeSelection() {
  const [enabled, setEnabled] = useState(true);
  const [time, setTime] = useState('');

  const handleEnabling = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
  }

  const handleChange = (event: SelectChangeEvent) => {
    setTime(event.target.value as string);
  };


  return (
    <>
      <Typography>
        Section
      </Typography>
      <Box sx={{ p: 2, border: '1px dashed grey' }}>
        <Stack direction="row">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Set time for all days"
              sx={{ width: 150 }}
              onChange={(event) => handleEnabling(event as React.ChangeEvent<HTMLInputElement>)}
            />
          </FormGroup>
          <FormControl sx={{ minWidth: "10%" }}>
            <InputLabel id='general-select-label'>Start Time</InputLabel>
            <Select
              labelId="general-select-label"
              id="general-select"
              value={time}
              label="Start Time"
              onChange={handleChange}
            >
              {classStartTimes.map((time) => {
                return <MenuItem value={time}>{time}</MenuItem>
              })}
            </Select>
          </FormControl>
        </Stack>
        <Divider sx={{ m: 2 }} />
        <Stack spacing={1}>
          {days.map((day) => {
            return <SpecificDay day={day} key={day} general={enabled} defaultValue={time} />;
          })}
        </Stack>
      </Box>
    </>
  )

}


export default SectionTimeSelection;