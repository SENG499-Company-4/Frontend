import React from 'react';
import SurveyForm from 'components/organisms/SurveyForm';
import Typography from '@mui/material/Typography';
import ClassData from 'data/clean.json';

function Survey() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Professor Survey Form
      </Typography>
      <SurveyForm formData={ClassData} />
      {/* TODO: Change to a proper class list retrieval */}
    </div>
  );
}

export default Survey;
