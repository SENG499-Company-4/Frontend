import React from 'react';
import ErrorImage from 'images/404.png';
import Button from '@mui/material/Button';

function ErrorPage() {
  return (
    <div className="Wraper" style={{ textAlign: 'center' }}>
      <img src={ErrorImage} alt="404" />
      <h2>This Page is Lost in the Wind</h2>
      <br />
      <Button variant="text" href="/">
        Back to Home Page
      </Button>
    </div>
  );
}

export default ErrorPage;
