import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_SCHEDULE } from 'components/shared/api/Queries';
import LoadingSpinner from 'components/organisms/LoadingSpinner';
import ErrorPage from './ErrorPage';

function Schedule() {
  const { loading, error, data } = useQuery(GET_SCHEDULE, {
    variables: {
      year: 2022
    }
  });

  if (!data || loading) {
    return <LoadingSpinner />;
  } else if (error) {
    return <ErrorPage code={'400'} message="Schedule retrieval failed. Please try again." />;
  }
  console.log(data);
  return <div>{data.schedule}</div>;
}

export default Schedule;
