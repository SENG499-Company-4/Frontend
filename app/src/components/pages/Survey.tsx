import React from 'react';
import Stack from '@mui/material/Stack';
import SurveyClassQuestion from 'components/organisms/SurveyClassQuestion';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

function Survey() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <SurveyClassQuestion name="Seng 310" />
          <SurveyClassQuestion name="Seng 265" />
          <FormControlLabel control={<Checkbox defaultChecked />} label="Have Relief?"/>
          <TextField
            id="outlined-textarea"
            label="Explanation"
            multiline
            style = {{width: 500}}
            inputProps={{ style: { color: 'black' } }}
          />

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
        </Stack>

        
      </form>
    </div>
  );
}

export default Survey;
