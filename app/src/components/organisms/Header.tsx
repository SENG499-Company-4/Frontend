import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function Header() {
  function navTo(pageName: string) {
    return () => {
      window.location.href = `${pageName}`;
    };
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Button onClick={navTo('/')} color="inherit">
            Home
          </Button>
          <Button onClick={navTo('/login')} color="inherit">
            Login
          </Button>
          <Button onClick={navTo('/dashboard')} color="inherit">
            Dashboard
          </Button>
          <Button onClick={navTo('/survey')} color="inherit">
            Survey
          </Button>
          <Button onClick={navTo('/schedule')} color="inherit">
            Schedule
          </Button>
          <Button onClick={navTo('/schedule/manage')} color="inherit">
            Schedule Manage
          </Button>
          <Button onClick={navTo('/schedule/timetable')} color="inherit">
            Schedule Timetable
          </Button>
          <Button onClick={navTo('/schedule/generate')} color="inherit">
            Schedule Generate
          </Button>
          <Button onClick={navTo('/professorprofile')} color="inherit">
            Professor Profile
          </Button>
        </Box>
      </AppBar>
    </Box>
  );
}

export default Header;
