import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Term } from 'constants/timetable.constants';
import { Typography } from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { ISchedule } from 'interfaces/scheduleManage.interfaces';

const semesterTypes: Term[] = ['SUMMER', 'WINTER', 'SPRING'];

// To match API
const sampleSchedules: ISchedule[] = [
  {
    id: 1,
    year: 2022,
    createdAt: new Date(),
    courses: [],
    term: 'SUMMER'
  },
  {
    id: 2,
    year: 2022,
    createdAt: new Date(),
    courses: [],
    term: 'WINTER'
  },
  {
    id: 3,
    year: 2022,
    createdAt: new Date(),
    courses: [],
    term: 'SPRING'
  }
];

function ScheduleManage() {
  const [search, setSearch] = useState('');
  const [foundSchedules, setFoundSchedules] = useState<ISchedule[]>(sampleSchedules);
  const [semester, setSemester] = useState('SUMMER');
  const [year, setYear] = useState<Date | null>(new Date());

  let navigate: NavigateFunction = useNavigate();

  const filter = (inputText: string) => {
    if (inputText !== '') {
      const results = sampleSchedules.filter((schedule: ISchedule) => {
        const matchText = schedule.term + ' ' + schedule.year;
        return matchText.toLowerCase().includes(inputText.toLowerCase());
      });
      setFoundSchedules(results);
    } else {
      // Show all schedules
      setFoundSchedules(sampleSchedules);
    }
    setSearch(inputText);
  };

  const bgColor = {
    SUMMER: '#ff9800',
    WINTER: '#03a9f4',
    SPRING: '#ffc107'
  };

  const semesterIcon = {
    SUMMER: <WbSunnyIcon />,
    WINTER: <AcUnitIcon />,
    SPRING: <LocalFloristIcon />
  };

  return (
    <Box sx={{ flexGrow: 1, margin: 5 }}>
      <Typography variant="h5" marginBottom={2}>
        Manage Existing Schedules
      </Typography>
      <Grid container rowSpacing={3} alignItems={'center'}>
        <Grid item>
          <TextField
            id="outlined-basic"
            label="Search schedules..."
            variant="outlined"
            type="search"
            value={search}
            onChange={(e) => filter(e.target.value)}
            className="input"
            placeholder="Keyword"
            sx={{ width: 350 }}
          />
        </Grid>
        <Grid item xs={12}>
          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 350,
              '& ul': { padding: 0 }
            }}
            subheader={<li />}
          >
            {foundSchedules && foundSchedules.length > 0 ? (
              foundSchedules.map((schedule) => (
                <ListItem key={schedule.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: bgColor[schedule.term] }}>{semesterIcon[schedule.term]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={schedule.term} secondary={schedule.year} />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate('/schedule/timetable');
                    }}
                  >
                    View
                  </Button>
                  <Typography variant="body2" marginLeft={2}>
                    Generated on {schedule.createdAt.toString()}
                  </Typography>
                </ListItem>
              ))
            ) : (
              <Typography variant="subtitle1">No schedules found!</Typography>
            )}
          </List>
        </Grid>

        <Typography variant="h5" marginY={4}>
          Generate New Schedule
        </Typography>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid item>
            <TextField
              id="select-semester"
              select
              label="Select Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              style={{ width: '300px' }}
            >
              {semesterTypes.map((semesterItem: Term) => (
                <MenuItem key={semesterItem} value={semesterItem}>
                  {semesterItem}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['year']}
                label="Year"
                value={year}
                onChange={(e) => setYear(e)}
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="large"
              onClick={() =>
                navigate(`/schedule/generate`, {
                  state: {
                    semester,
                    year
                  }
                })
              }
            >
              Generate Schedule
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ScheduleManage;
