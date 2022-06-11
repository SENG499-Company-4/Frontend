import React from 'react';
import SurveyForm from 'components/organisms/SurveyForm';
import Typography from '@mui/material/Typography';
import ClassData from 'data/clean.json';
import { Box } from '@mui/system';

function Survey() {
  return (
    <Box marginTop={2} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Typography variant="h4" gutterBottom marginY={4}>
        Professor Survey Form
      </Typography>
      <SurveyForm formData={ClassData} />
      {/* TODO: Change to a proper class list retrieval */}
    </Box>
  );
}

export default Survey;
