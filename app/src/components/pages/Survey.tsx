import React from 'react';
import SurveyForm from 'components/organisms/SurveyForm';
import Typography from '@mui/material/Typography';

function Survey() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Professor Survey Form
      </Typography>
      <SurveyForm formData={classData} />
      {/* input some proper data with that call */}
    </div>
  );
}

const classData = [
  { subject: 'CSC', code: '105', term: 'SPRING' },
  { subject: 'CSC', code: '106', term: 'SPRING' },
  { subject: 'SENG', code: '310', term: 'SPRING' },
  { subject: 'SENG', code: '265', term: 'SPRING' },
  { subject: 'SENG', code: '275', term: 'SPRING' },
  { subject: 'ECE', code: '116', term: 'SPRING' },
  { subject: 'SENG', code: '440', term: 'SPRING' },
  { subject: 'ECE', code: '260', term: 'SPRING' },
  { subject: 'ECE', code: '360', term: 'SPRING' }
];

export default Survey;
