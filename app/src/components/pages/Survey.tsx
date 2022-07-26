import React, { useContext, useEffect, useState } from 'react';
import SurveyForm from 'components/organisms/SurveyForm';
import Typography from '@mui/material/Typography';
import { courseCodes } from 'constants/courses.constants';
import { Box } from '@mui/system';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { useQuery } from '@apollo/client';
import { GET_ME } from 'api/Queries';

function Survey() {
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { loading: meLoading, error: meError, data: meData } = useQuery(GET_ME);

  useEffect(() => {
    loadingContext.setLoading(meLoading);
    if (meError) {
      errorContext.setErrorDialog(meError);
    }
    if (meData) {
      if (meData.me.preferences && meData.me.preferences.length > 0) {
        for (const pref of meData.me.preferences) {
          if (pref.id.year === 2022) {
            setSubmitted(true);
            break;
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meData, meLoading, meError]);

  return (
    <Box marginTop={2} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Typography variant="h4" gutterBottom marginY={4}>
        Professor Survey Form
      </Typography>
      {!submitted ? (
        <SurveyForm formData={courseCodes} />
      ) : (
        <Typography gutterBottom marginY={4}>
          You have already submitted your survey for this academic year. Please contact the site administrator to reset
          your preferences if re-submission is necessary.
        </Typography>
      )}
    </Box>
  );
}

export default Survey;
