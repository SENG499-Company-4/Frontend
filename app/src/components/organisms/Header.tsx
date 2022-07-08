import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import HeaderButton from 'components/molecules/HeaderButton';
import { Typography } from '@mui/material';
import HeaderMenu from 'components/molecules/HeaderMenu';
import { Role } from 'components/shared/constants/timetable.constants';
import { IUser } from 'components/shared/interfaces/user.interfaces';
import {
  CalendarMonth,
  Event,
  EventRepeat,
  Home,
  Login,
  ModeEdit,
  Poll,
  People,
  School,
  Today,
  AddCircle
} from '@mui/icons-material';

const appLogo = require('assets/app-logo.png');

function Header(props: { user: IUser }) {
  const role = props.user?.role as Role;
  if (!role) {
    return null;
  }
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
            {role === Role.User ? <HeaderButton key="survey" label="Survey" url="/survey" icon={<Poll />} /> : null}
            <HeaderMenu key="schedule" label="Schedule" icon={<CalendarMonth />}>
              <HeaderButton key="view-schedule" label="View Schedule" url="/schedule" icon={<Today />} />
              {role === Role.Admin ? (
                <HeaderButton
                  key="manage-schedule"
                  label="Manage Schedule"
                  url="/schedule/manage"
                  icon={<ModeEdit />}
                />
              ) : null}
              {role === Role.Admin ? (
                <HeaderButton
                  key="generate-schedule"
                  label="Generate Schedule"
                  url="/schedule/generate"
                  icon={<EventRepeat />}
                />
              ) : null}
              <HeaderButton
                key="schedule-timetable"
                label="Schedule Timetable"
                url="/schedule/timetable"
                icon={<Event />}
              />
            </HeaderMenu>
            {role === Role.Admin ? (
              <HeaderButton key="professors" label="Professors" url="/professors" icon={<People />} />
            ) : null}
            {/* TODO: Have this route to the current user's ID */}
            <HeaderButton key="professor/" label="Profile" url="/professors/me" icon={<School />} />
            {role === Role.Admin ? (
              <HeaderButton key="register-user" label="Create New User" url="/register" icon={<AddCircle />} />
            ) : null}
            <HeaderButton
              key="login"
              label={role ? 'Logout' : 'Login'}
              url={role ? '/logout' : '/login'}
              icon={<Login />}
            />
          </Box>
        </Box>
      </AppBar>
    </Box>
  );
}

export default Header;
