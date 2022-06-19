import React, { useState } from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Grid from '@mui/material/Grid';
import Avatar from "@mui/material/Avatar";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuItem from '@mui/material/MenuItem';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const semesterTypes = [
  {
    value: 'summer',
    label: 'Summer',
  },
  {
    value: 'winter',
    label: 'Winter',
  },
  {
    value: 'fall',
    label: 'Fall',
  }
];

const schedules = [
  {
    id: 1,
    semester: "Summer",
    year: 2022,
    date: "06-12-2022",
    name: "Summer 2022 06-12-2022"
  },
  {
    id: 2,
    semester: "Winter",
    year: 2022,
    date: "01-12-2022",
    name: "Winter 2022 01-12-2022"
  },
  {
    id: 3,
    semester: "Fall",
    year: 2022,
    date: "09-12-2022",
    name: "Fall 2022 09-12-2022"
  },
  {
    id: 4,
    semester: "Summer",
    year: 2021,
    date: "06-12-2021",
    name: "Summer 2021 06-12-2021"
  },
  {
    id: 5,
    semester: "Winter",
    year: 2021,
    date: "01-12-2021",
    name: "Winter 2021 01-12-2021"
  },
  {
    id: 6,
    semester: "Fall",
    year: 2021,
    date: "09-12-2021",
    name: "Fall 2021 09-12-2021"
  }
];

function ScheduleManage() {
  const [search, setSearch] = useState("");
  const [foundSchedules, setFoundSchedules] = useState(schedules);
  const [semester, setSemester] = useState('Summer');
  const [year, setYear] = useState<Date | null>(new Date());

  let navigate: NavigateFunction = useNavigate();

  const filter = (e: any) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = schedules.filter((schedule) => {
        return schedule.name.toLowerCase().includes(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundSchedules(results);
    } else {
      setFoundSchedules(schedules);
      // If the text field is empty, show all users
    }

    setSearch(keyword);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems={'center'}>
          <Grid item xs={4}>
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              type="search"
              value={search}
              onChange={filter}
              className="input"
              placeholder="Keyword"
              sx={{ width: 350 }}
            />
          </Grid>
          <Grid item xs={12}>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                maxHeight: 350,
                "& ul": { padding: 0 }
              }}
              subheader={<li />}
            >
              {foundSchedules && foundSchedules.length > 0 ? (
                foundSchedules.map((schedule) => (
                  <ListItem key={schedule.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <CalendarMonthIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={schedule.semester}
                      secondary={schedule.year}
                    />
                    <Button variant="outlined">View</Button>
                    <span style={{ marginLeft: 30 }}>
                      Generated on {schedule.date}
                    </span>
                  </ListItem>
                ))
              ) : (
                <h2>No schedules found!</h2>
              )}
            </List>
          </Grid>
          <Grid item xs={4}>
            <TextField
              id="select-semester"
              select
              label="Select Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {semesterTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => navigate(`/schedule/generate`, {
              state:
              {
                semester: { semester },
                year: { year }
              }
            })}>Generate Schedule</Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default ScheduleManage;