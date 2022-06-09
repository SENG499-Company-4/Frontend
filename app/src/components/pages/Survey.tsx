import React from 'react';
import SurveyForm from 'components/organisms/SurveyForm';
import Typography from '@mui/material/Typography';
import myData from '../../classList.json';

function Survey() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Professor Survey Form
      </Typography>
      <SurveyForm formData={myData} />
      {/* TODO: Change to a proper class list retrieval */}
    </div>
  );
}

export default Survey;
