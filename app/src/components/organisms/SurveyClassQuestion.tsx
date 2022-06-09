import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';

function SurveyClassQuestion(props: {
  name: string;
  nameChanged: (fieldId: string, type: string, value: string) => void;
}) {
  const [disabled, setDisabled] = useState(true);
  const [checked, setChecked] = useState({ willing: false, notWilling: false, veryWilling: false });

  const handleDisabling = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'cannot') {
      setDisabled(event.target.checked);

      setChecked(() => {
        return {
          willing: false,
          notWilling: false,
          veryWilling: false
        };
      });
    } else {
      setDisabled(!event.target.checked);
    }
    props.nameChanged(props.name, 'ability', event.target.value);
  };

  const changeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(() => {
      return {
        willing: false,
        notWilling: false,
        veryWilling: false,
        [event.target.value]: true
      };
    });

    props.nameChanged(props.name, 'willing', (event.target as HTMLInputElement).value);
  };

  return (
    <Stack key={props.name} direction="row" spacing={5}>
      <FormControl>
        <FormLabel required id="CanTeach">
          {props.name}
        </FormLabel>
        <RadioGroup row aria-labelledby="CanTeach" name="row-radio-buttons-group">
          <FormControlLabel
            onChange={(e) => handleDisabling(e as React.ChangeEvent<HTMLInputElement>)}
            value="cannot"
            control={<Radio />}
            label="Can't Teach"
          />
          <FormControlLabel
            onChange={(e) => handleDisabling(e as React.ChangeEvent<HTMLInputElement>)}
            value="can"
            control={<Radio />}
            label="Able To Teach"
          />
          <FormControlLabel
            onChange={(e) => handleDisabling(e as React.ChangeEvent<HTMLInputElement>)}
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
            onChange={(e) => changeRadio(e as React.ChangeEvent<HTMLInputElement>)}
            checked={checked.notWilling}
            disabled={disabled}
            value="notWilling"
            control={<Radio />}
            label="Not Willing"
          />
          <FormControlLabel
            onChange={(e) => changeRadio(e as React.ChangeEvent<HTMLInputElement>)}
            checked={checked.willing}
            disabled={disabled}
            value="willing"
            control={<Radio />}
            label="Willing"
          />
          <FormControlLabel
            onChange={(e) => changeRadio(e as React.ChangeEvent<HTMLInputElement>)}
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
