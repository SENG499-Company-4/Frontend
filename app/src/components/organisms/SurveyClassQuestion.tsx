import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';

function SurveyClassQuestion(props: { name: string }) {
  const [disabled, setDisabled] = useState(true);
  const [checked, setChecked] = useState({ willing: false, notWilling: false, veryWilling: false });

  const handleEnable = (event: React.SyntheticEvent<Element, Event>) => {
    setDisabled(!(event.target as HTMLInputElement).checked);
    console.log(checked);
  };

  const handleDisable = (event: React.SyntheticEvent<Element, Event>) => {
    setDisabled((event.target as HTMLInputElement).checked);

    setChecked(() => {
      return {
        willing: false,
        notWilling: false,
        veryWilling: false
      };
    });
  };

  const changeRadio = (e: React.SyntheticEvent<Element, Event>) => {
    setChecked(() => {
      return {
        willing: false,
        notWilling: false,
        veryWilling: false,
        [(e.target as HTMLInputElement).value]: true
      };
    });
  };

  return (
    <Stack direction="row" spacing={5}>
      <FormControl>
        <FormLabel required id="CanTeach">
          {props.name}
        </FormLabel>
        <RadioGroup row aria-labelledby="CanTeach" name="row-radio-buttons-group">
          <FormControlLabel onChange={handleDisable} value="cannot" control={<Radio />} label="Can't Teach" />
          <FormControlLabel onChange={handleEnable} value="can" control={<Radio />} label="Able To Teach" />
          <FormControlLabel
            onChange={handleEnable}
            value="effort"
            control={<Radio />}
            label="Able to Teach with Effort"
          />
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel id="WantToTeach">Willingness to teach</FormLabel>
        <RadioGroup row aria-labelledby="WantToTeach" name="row-radio-buttons-group">
          <FormControlLabel
            onChange={changeRadio}
            checked={checked.notWilling}
            disabled={disabled}
            value="notWilling"
            control={<Radio />}
            label="Not Willing"
          />
          <FormControlLabel
            onChange={changeRadio}
            checked={checked.willing}
            disabled={disabled}
            value="willing"
            control={<Radio />}
            label="Willing"
          />
          <FormControlLabel
            onChange={changeRadio}
            checked={checked.veryWilling}
            disabled={disabled}
            value="veryWilling"
            control={<Radio />}
            label="Very Willing"
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}

export default SurveyClassQuestion;
