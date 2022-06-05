import React from 'react';
import Button from '@mui/material/Button';
import uviclogo from 'images/uviclogo.png';

function Home() {
  const style = {
    margin: 'auto',
    color: 'black',
    textAlign: 'center' as 'center',
    padding: '15%'
  };

  return (
    <div className="primaryContainer">
      <div className="Title">
        <img src={uviclogo} alt="uviclogo" width={150} style={{ float: 'left' }}></img>
        <h1 style={{ paddingLeft: '37%' }}> University Scheduler System</h1>
      </div>

      <hr />

      <div className="Text" style={style}>
        <p>Hello World!!</p>
        <br />
        <p>This is the Home page of our University Scheduler System.</p>
      </div>

      <div className="Button" style={{ textAlign: 'center' }}>
        <Button variant="contained" href="/login">
          Log in
        </Button>
      </div>
    </div>
  );
}

export default Home;
