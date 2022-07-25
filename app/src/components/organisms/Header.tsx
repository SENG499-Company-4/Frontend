import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import HeaderButton from 'components/molecules/HeaderButton';
import { Button, Typography } from '@mui/material';
import HeaderMenu from 'components/molecules/HeaderMenu';
import { Role } from 'constants/timetable.constants';
import {
  CalendarMonth,
  EventRepeat,
  Home,
  Login,
  Poll,
  People,
  School,
  Today,
  AddCircle,
  Power,
  Person,
  CalendarViewDay,
  Brightness7,
  Bedtime
} from '@mui/icons-material';
import { ThemeContext } from 'contexts/DynamicThemeProvider';
import { UserCookie } from 'router/AppRouter';

const appLogo = require('assets/app-logo.png');

function Header(props: { user: UserCookie }) {
  const role = props.user?.role as Role;
  const themeContext = useContext(ThemeContext);
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
            <Button
              color="inherit"
              onClick={() => {
                themeContext.setThemeType(!themeContext.themeType);
              }}
              startIcon={themeContext.themeType ? <Brightness7 /> : <Bedtime />}
            >
              Toggle Dark Mode
            </Button>
            <HeaderButton key="home" label="Home" url="/" icon={<Home />} />
            {role === Role.User ? <HeaderButton key="survey" label="Survey" url="/survey" icon={<Poll />} /> : null}
            <HeaderMenu key="schedule" label="Schedule" icon={<CalendarMonth />}>
              <HeaderButton key="view-schedule" label="View Schedule" url="/schedule" icon={<Today />} />
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
                icon={<CalendarViewDay />}
              />
            </HeaderMenu>
            {role === Role.Admin ? (
              <HeaderMenu key="professors" label="Professors" icon={<School />}>
                <HeaderButton key="professors-list" label="Professors List" url="/professors" icon={<People />} />
                <HeaderButton key="register-user" label="Create New User" url="/register" icon={<AddCircle />} />
              </HeaderMenu>
            ) : null}
            {role === Role.Admin ? (
              <HeaderButton key="plug-and-play" label="Plug and Play" url="/plug-and-play" icon={<Power />} />
            ) : null}
            <HeaderButton key="profile" label="Profile" url={'/professors/' + props.user.userId} icon={<Person />} />
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
