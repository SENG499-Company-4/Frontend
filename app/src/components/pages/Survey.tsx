import React from 'react';
import Stack from '@mui/material/Stack';
import SurveyClassQuestion from 'components/organisms/SurveyClassQuestion';
import Button from '@mui/material/Button';

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
        </Stack>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Survey;
