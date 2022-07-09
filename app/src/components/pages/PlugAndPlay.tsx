import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import {
  backendUrl,
  backendUrlInverse,
  company,
  companyInverse
} from 'components/shared/constants/plugandplay.constants';
import LoadingSpinner from 'components/organisms/LoadingSpinner';

const companies: company[] = [company.company3, company.company4];

function PlugAndPlay() {
  const cookies = new Cookies();
  const [backend, setBackend] = useState('');
  const [algorithm1, setAlgorithm1] = useState('');
  const [algorithm2, setAlgorithm2] = useState('');
  const [warningDialogOpen, setWarningDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [oldConfig, setOldConfig] = useState<any>({});

  const getChanges = () => {
    let changeStrings = [];
    const oldBackend = backendUrl[oldConfig.REACT_APP_BACKEND_URL as keyof typeof backendUrl];
    const oldAlgorithm1 = company[oldConfig.REACT_APP_ALGORITHM_1 as keyof typeof company];
    const oldAlgorithm2 = company[oldConfig.REACT_APP_ALGORITHM_2 as keyof typeof company];

    if (oldBackend !== backend) {
      changeStrings.push(`Backend changed from ${oldBackend} to ${backend}\n`);
    }
    if (oldAlgorithm1 !== algorithm1) {
      changeStrings.push(`Algorithm 1 changed from ${oldAlgorithm1} to ${algorithm1}\n`);
    }
    if (oldAlgorithm2 !== algorithm2) {
      changeStrings.push(`Algorithm 2 changed from ${oldAlgorithm2} to ${algorithm2}\n`);
    }
    if (changeStrings.length === 0) {
      changeStrings.push('No Changes');
    }
    return changeStrings;
  };
  const submitChanges = () => {
    const config = {
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${process.env.REACT_APP_HEROKU}`,
        'Content-Type': 'application/json'
      }
    };
    const configVars = {
      REACT_APP_BACKEND_URL: backendUrlInverse[backend as keyof typeof backendUrlInverse],
      REACT_APP_ALGORITHM_1: companyInverse[algorithm1 as keyof typeof companyInverse],
      REACT_APP_ALGORITHM_2: companyInverse[algorithm2 as keyof typeof companyInverse]
    };
    axios.patch('https://api.heroku.com/apps/seng499company4frontend/config-vars', configVars, config).then((res) => {
      console.log(res);
      cookies.remove('user');
      window.location.href = '/';
    });
  };

  useEffect(() => {
    const config = {
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${process.env.REACT_APP_HEROKU}`
      }
    };
    axios.get(`https://api.heroku.com/apps/seng499company4frontend/config-vars`, config).then((res) => {
      const configVars = res.data;
      setOldConfig(configVars);
      setBackend(backendUrl[configVars.REACT_APP_BACKEND_URL as keyof typeof backendUrl]);
      setAlgorithm1(company[configVars.REACT_APP_ALGORITHM_1 as keyof typeof company]);
      setAlgorithm2(company[configVars.REACT_APP_ALGORITHM_2 as keyof typeof company]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner isLoading={true} />;
  } else {
    return (
      <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Dialog
          fullWidth={true}
          maxWidth={'sm'}
          open={warningDialogOpen}
          onClose={() => {
            setWarningDialogOpen(false);
          }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Warning'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" marginBottom={'10px'}>
              You requested the following changes:
            </DialogContentText>
            <Divider />
            {getChanges().map((string) => {
              return <DialogContentText id="alert-dialog-slide-description">- {string}</DialogContentText>;
            })}
            <Divider />
            <DialogContentText id="alert-dialog-slide-description" marginTop={'10px'}>
              By pressing "Ok", you are agree to change these algorithm and backend connections for this app.
            </DialogContentText>
            <DialogContentText id="alert-dialog-slide-description" marginTop={'10px'}>
              If you change the backend connection, you will lose access to all database-stored content associated with
              this backend. This includes existing users, schedules, and preference surveys. If you change either
              algorithm, you will experience different algorithmic results.
            </DialogContentText>
            <DialogContentText id="alert-dialog-slide-description" marginTop={'10px'}>
              The app will restart and you will be logged out if you proceed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setWarningDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                submitChanges();
              }}
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <Typography variant="h4" gutterBottom marginY={4} textAlign={'center'}>
          Plug and Play
        </Typography>
        <Grid container justifyContent={'center'}>
          <Grid container rowSpacing={3} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="h6" marginY={6} paddingRight={'35px'}>
              Back End:
            </Typography>
            <TextField
              id="select-backend"
              select
              label="Select Back End"
              value={backend}
              onChange={(e) => setBackend(e.target.value)}
              style={{ width: '300px' }}
            >
              {companies.map((company: company) => (
                <MenuItem key={company} value={company}>
                  {company}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid container rowSpacing={3} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="h6" marginY={6} paddingRight={'20px'}>
              Algorithm 1:
            </Typography>
            <TextField
              id="select-algorithm-1"
              select
              label="Select Algorithm 1"
              value={algorithm1}
              onChange={(e) => setAlgorithm1(e.target.value)}
              style={{ width: '300px' }}
            >
              {companies.map((company: company) => (
                <MenuItem key={company} value={company}>
                  {company}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid container rowSpacing={3} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="h6" marginY={6} paddingRight={'20px'}>
              Algorithm 2:
            </Typography>
            <TextField
              id="select-algorithm-2"
              select
              label="Select Algorithm 2"
              value={algorithm2}
              onChange={(e) => setAlgorithm2(e.target.value)}
              style={{ width: '300px' }}
            >
              {companies.map((company: company) => (
                <MenuItem key={company} value={company}>
                  {company}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Button variant="contained" size="large" onClick={() => setWarningDialogOpen(true)}>
            Save
          </Button>
        </Grid>
      </Box>
    );
  }
}

export default PlugAndPlay;
