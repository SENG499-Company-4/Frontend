import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import HeaderButton from 'components/molecules/HeaderButton';

function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <HeaderButton label="Home" url="/" />
          <HeaderButton label="Login" url="/login" />
          <HeaderButton label="Dashboard" url="/dashboard" />
          <HeaderButton label="Survey" url="/survey" />
          <HeaderButton label="Schedule" url="/schedule" />
          <HeaderButton label="Manage Schedule" url="/schedule/manage" />
          <HeaderButton label="Schedule Timetable" url="/schedule/timetable" />
          <HeaderButton label="Generate Schedule" url="/schedule/generate" />
          <HeaderButton label="Professor Profile" url="/professor-profile" />
        </Box>
      </AppBar>
    </Box>
  );
}

export default Header;
