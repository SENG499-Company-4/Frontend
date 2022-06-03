import React from 'react';
import Button from '@mui/material/Button';

function Home() {
  const Homestyle = {
    margin: 'auto', 
    color: 'black',
    textAlign: "center" as "center",
    padding:'5%'
  }
  
  return (
    <div className="primaryTitle">
      <h1 style={{textAlign: 'center' }}>University Scheduler System</h1>
      <hr />
      <div style={Homestyle}>Hello World!!</div>
      <br />
      <div style={Homestyle}>This is the Home page of our University Scheduler System.</div>
      <div style={Homestyle}><Button variant='contained' href='/login'>Log in</Button></div>
    </div>
    
  );
}

export default Home;
