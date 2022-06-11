import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import { willingRadio, ability, willing } from '../shared/constants/surveyForm.constants';

function SurveyClassQuestion(props: {
  name: string;
  additionalQualifications: boolean;
  fieldChanged: (fieldId: string, type: string, value: string) => void;
}) {
  const [disabled, setDisabled] = useState(true);
  const [checked, setChecked] = useState({ willing: false, notWilling: false, veryWilling: false });

  const handleDisabling = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === ability.cannot) {
      setDisabled(event.target.checked);
      setChecked(willingRadio);
    } else {
      setDisabled(!event.target.checked);
      setChecked(() => {
        return {
          ...willingRadio,
          notWilling: true
        };
      });
    }
    props.fieldChanged(props.name, 'ability', event.target.value);
  };

  const changeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(() => {
      return {
        ...willingRadio,
        [event.target.value]: true
      };
    });
    props.fieldChanged(props.name, 'willing', (event.target as HTMLInputElement).value);
  };

  return (
    <Stack key={props.name} direction="row" spacing={5}>
      <FormLabel required={props.additionalQualifications} id="CanTeach">
        {props.name}
      </FormLabel>
      <FormControl>
        <RadioGroup row aria-labelledby="CanTeach" name="row-radio-buttons-group" defaultValue="cannot">
          <FormControlLabel
            onChange={(e) => handleDisabling(e as React.ChangeEvent<HTMLInputElement>)}
            value={ability.cannot}
            control={<Radio />}
            label="Can't Teach"
          />
          <FormControlLabel
            onChange={(e) => handleDisabling(e as React.ChangeEvent<HTMLInputElement>)}
            value={ability.can}
            control={<Radio />}
            label="Able To Teach"
          />
          <FormControlLabel
            onChange={(e) => handleDisabling(e as React.ChangeEvent<HTMLInputElement>)}
            value={ability.effort}
            control={<Radio />}
            label="Able to Teach with Effort"
          />
        </RadioGroup>
      </FormControl>

      <FormControl>
        <RadioGroup row aria-labelledby="WantToTeach" name="row-radio-buttons-group">
          <FormControlLabel
            onChange={(e) => changeRadio(e as React.ChangeEvent<HTMLInputElement>)}
            checked={checked.notWilling}
            disabled={disabled}
            value={willing.notWilling}
            control={<Radio />}
            label="Not Willing"
          />
          <FormControlLabel
            onChange={(e) => changeRadio(e as React.ChangeEvent<HTMLInputElement>)}
            checked={checked.willing}
            disabled={disabled}
            value={willing.willing}
            control={<Radio />}
            label="Willing"
          />
          <FormControlLabel
            onChange={(e) => changeRadio(e as React.ChangeEvent<HTMLInputElement>)}
            checked={checked.veryWilling}
            disabled={disabled}
            value={willing.veryWilling}
            control={<Radio />}
            label="Very Willing"
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}

export default SurveyClassQuestion;
