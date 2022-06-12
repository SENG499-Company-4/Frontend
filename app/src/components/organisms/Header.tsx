import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import HeaderButton from 'components/molecules/HeaderButton';
import { Typography } from '@mui/material';
import HeaderMenu from 'components/molecules/HeaderMenu';
import {
  CalendarMonth,
  Dashboard,
  Event,
  EventRepeat,
  Home,
  Login,
  ModeEdit,
  Poll,
  School,
  Today
} from '@mui/icons-material';

const appLogo = require('assets/app-logo.png');

function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Box display="flex" flexDirection="row" marginX={4} height={'70px'}>
          <Box marginY={2} display="flex" flexDirection="row">
            <img src={appLogo} alt="app-logo" height={'40px'}></img>
            <Typography variant="h4" marginLeft={2}>
              Scheduler
            </Typography>
          </Box>
          <Box display="flex" flexGrow={1} flexDirection="row" justifyContent="space-between" marginX={4}>
            <HeaderButton key="home" label="Home" url="/" icon={<Home />} />
            <HeaderButton key="dashboard" label="Dashboard" url="/dashboard" icon={<Dashboard />} />
            <HeaderButton key="survey" label="Survey" url="/survey" icon={<Poll />} />
            <HeaderMenu key="schedule" label="Schedule" icon={<CalendarMonth />}>
              <HeaderButton key="view-schedule" label="View Schedule" url="/schedule" icon={<Today />} />
              <HeaderButton key="manage-schedule" label="Manage Schedule" url="/schedule/manage" icon={<ModeEdit />} />
              <HeaderButton
                key="generate-schedule"
                label="Generate Schedule"
                url="/schedule/generate"
                icon={<EventRepeat />}
              />
              <HeaderButton
                key="schedule-timetable"
                label="Schedule Timetable"
                url="/schedule/timetable"
                icon={<Event />}
              />
            </HeaderMenu>
            <HeaderButton
              key="professor-profile"
              label="Professor Profile"
              url="/professor-profile"
              icon={<School />}
            />
            <HeaderButton key="login" label="Login" url="/login" icon={<Login />} />
          </Box>
        </Box>
      </AppBar>
    </Box>
  );
}

export default Header;
