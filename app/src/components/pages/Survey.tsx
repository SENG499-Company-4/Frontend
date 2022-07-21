import React, { useContext, useEffect } from 'react';
import SurveyForm from 'components/organisms/SurveyForm';
import Typography from '@mui/material/Typography';
import { courseCodes } from 'constants/courses.constants';
import { Box } from '@mui/system';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { useQuery } from '@apollo/client';
import { GET_COURSES } from 'api/Queries';

function Survey() {
  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);

  const { data: courseData, loading: courseLoading, error: courseError } = useQuery(GET_COURSES);

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
      <SurveyForm formData={courseCodes} />
    </Box>
  );
}

export default Survey;
