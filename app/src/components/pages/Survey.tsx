import React, { useContext, useEffect, useState } from 'react';
import SurveyForm from 'components/organisms/SurveyForm';
import Typography from '@mui/material/Typography';
import { courseCodes } from 'constants/courses.constants';
import { Box } from '@mui/system';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { useQuery } from '@apollo/client';
import { GET_COURSES, GET_ME } from 'api/Queries';

function Survey() {
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const { data: courseData, loading: courseLoading, error: courseError } = useQuery(GET_COURSES);
  const {loading: meLoading, error: meError, data: meData} = useQuery(GET_ME);

  useEffect(() => {
    loadingContext.setLoading(meLoading);
    if (meError) {
      errorContext.setErrorDialog(meError);
    }
    if (meData) {
      if (meData.me.preferences && meData.me.preferences.length() > 0) {
        setSubmitted(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meData, meLoading, meError]);

  useEffect(() => {
    loadingContext.setLoading(courseLoading);
    if (courseError) {
      errorContext.setErrorDialog(courseError);
    }
    if (courseData) {
      console.log('Got course data!', courseData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseData, courseLoading, courseError]);

  return (
    <Box marginTop={2} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Typography variant="h4" gutterBottom marginY={4}>
        Professor Survey Form
      </Typography>
      {
        !submitted ? ( 
          <SurveyForm formData={courseCodes} />
        ) : 
        "You have already submitted your survey for this academic year."
      }
    </Box>
  );
}

export default Survey;
