import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import SurveyClassQuestion from 'components/organisms/SurveyClassQuestion';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { classData, formVals, vals } from 'components/shared/interfaces/surveyForm.interfaces';
import { overallDefaults } from 'components/shared/constants/surveyForm.constants';

function SurveyForm(props: { formData: classData[] }) {
  const additionalQualifications: boolean = false; //TODO: temporary measure until backend implements qualifications to class info
  const [disable, setDisabled] = useState(true);
  const [formats, setFormats] = useState<string[]>(() => []);
  const [role, setRole] = useState('Teaching');

  const [termPrefs, setTermPrefs] = useState({
    fall: 'Teaching',
    spring: 'Teaching',
    summer: 'Teaching'
  });

  const [values, setValues] = useState(() => {
    const currentValues: formVals = {
      role: 'Teaching',
      relief: 0,
      explanation: '',
      preferredDays: [],
      fall: 'Teaching',
      spring: 'Teaching',
      summer: 'Teaching',
      classes: 0,
      courses: {}
    };

    currentValues.courses = props.formData.reduce((obj: any, field) => {
      obj[field.CourseID.subject + ' ' + field.CourseID.code] = {
        ...overallDefaults
      };
      return obj;
    }, {});
    return currentValues;
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(values);
    e.preventDefault();
    //TODO: submit values somewhere
  };

  const fieldChanged = (courseName: string, type: string, value: string) => {
    setValues((currentValues) => {
      currentValues.courses[courseName][type as keyof vals] = value;
      return currentValues;
    });
  };

  const handleRelief = (event: React.ChangeEvent<HTMLInputElement>, amount: boolean) => {
    setValues((currentValues) => {
      if (amount) {
        const reliefAmount = Number(event.target.value);
        currentValues.relief = reliefAmount;
        if (reliefAmount > 0) {
          setDisabled(false);
        } else {
          setDisabled(true);
        }
      } else {
        currentValues.explanation = event.target.value;
      }
      return currentValues;
    });
  };

  const handleRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
    setValues((currentValues) => {
      currentValues.role = role;
      return currentValues;
    });
  };

  const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    event.preventDefault();
    setFormats(newFormats);
    setValues((currentValues) => {
      currentValues.preferredDays = newFormats;
      return currentValues;
    });
  };

  const handleTerm = (event: React.ChangeEvent<HTMLInputElement>, term: string) => {
    setValues((currentValues) => {
      const newVal = event.target.value;
      switch (term) {
        case 'fall':
          currentValues.fall = newVal;
          setTermPrefs({ ...termPrefs, fall: newVal });
          break;
        case 'spring':
          currentValues.spring = newVal;
          setTermPrefs({ ...termPrefs, spring: newVal });
          break;
        case 'summer':
          currentValues.summer = newVal;
          setTermPrefs({ ...termPrefs, summer: newVal });
          break;
        default:
          break;
      }
      return currentValues;
    });
  };

  const handleClasses = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((currentValues) => {
      const newVal = Number(event.target.value);
      currentValues.classes = newVal;
      return currentValues;
    });
  };

  return (
    <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
      <form onSubmit={onSubmit}>
        <Typography variant="overline" gutterBottom>
          * = additional qualifications neccessary
        </Typography>
        <Stack direction="row">
          <Typography variant="overline" gutterBottom sx={{ width: '30%' }}>
            {' '}
            Course Number{' '}
          </Typography>
          <Typography variant="overline" gutterBottom sx={{ width: '50%' }}>
            {' '}
            Ability{' '}
          </Typography>
          <Typography variant="overline" gutterBottom sx={{ width: '30%' }}>
            {' '}
            Willingness{' '}
          </Typography>
        </Stack>
        <Stack sx={{ height: `calc(50vh)`, overflowY: 'scroll' }} spacing={2}>
          {Object.keys(values.courses).map((field) => {
            return (
              <SurveyClassQuestion
                additionalQualifications={additionalQualifications}
                key={field}
                name={field}
                fieldChanged={fieldChanged}
              />
            );
          })}
        </Stack>
        <Divider sx={{ marginBottom: '1%' }} />
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <FormControl>
              <InputLabel id="select-role-label">Type of Faculty </InputLabel>
              <Select
                labelId="select-role-label"
                id="select-role"
                value={role}
                onChange={(event) => handleRole(event as React.ChangeEvent<HTMLInputElement>)}
                sx={{ color: 'black' }}
              >
                <MenuItem sx={{ color: 'black' }} value={'Teaching'}>
                  Teaching
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'Research'}>
                  Research
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="Relief Amount"
              label="Relief Amount"
              type="number"
              inputProps={{ style: { color: 'black' } }}
              onChange={(event) => handleRelief(event as React.ChangeEvent<HTMLInputElement>, true)}
            />

            <TextField
              id="Explanation-textarea"
              label="Explanation for relief"
              multiline
              maxRows={4}
              disabled={disable}
              style={{ width: '50%' }}
              inputProps={{ style: { color: 'black' } }}
              onChange={(event) => handleRelief(event as React.ChangeEvent<HTMLInputElement>, false)}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <ToggleButtonGroup value={formats} onChange={handleFormat} aria-label="text formatting" color="info">
              <InputLabel sx={{ marginTop: '10px', marginRight: '5px' }} id="Preferred-days-label">
                Preferred days to teach
              </InputLabel>
              <ToggleButton value="Monday" aria-label="Monday">
                M
              </ToggleButton>
              <ToggleButton value="Tuesday" aria-label="Tuesday">
                T
              </ToggleButton>
              <ToggleButton value="Wednesday" aria-label="Wednesday">
                W
              </ToggleButton>
              <ToggleButton value="Thursday" aria-label="Thursday">
                Th
              </ToggleButton>
              <ToggleButton value="Friday" aria-label="Friday">
                F
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              id="classesPerDay"
              label="Classes per day"
              type="number"
              inputProps={{ style: { color: 'black' } }}
              onChange={(event) => handleClasses(event as React.ChangeEvent<HTMLInputElement>)}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <InputLabel sx={{ marginTop: '10px', marginRight: '5px' }} id="Preferred-days-label">
              Preferred term type
            </InputLabel>
            <FormControl>
              <InputLabel id="select-role-label">Fall</InputLabel>
              <Select
                labelId="select-role-label"
                id="select-role"
                value={termPrefs.fall}
                onChange={(event) => handleTerm(event as React.ChangeEvent<HTMLInputElement>, 'fall')}
                sx={{ color: 'black' }}
              >
                <MenuItem sx={{ color: 'black' }} value={'Teaching'}>
                  Teaching
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'Research'}>
                  Research
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'HalfLeave'}>
                  Half Leave
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'FullLeave'}>
                  Full Leave
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="select-role-label">Spring</InputLabel>
              <Select
                labelId="select-role-label"
                id="select-role"
                value={termPrefs.spring}
                onChange={(event) => handleTerm(event as React.ChangeEvent<HTMLInputElement>, 'spring')}
                sx={{ color: 'black' }}
              >
                <MenuItem sx={{ color: 'black' }} value={'Teaching'}>
                  Teaching
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'NonTeaching'}>
                  Non-teaching
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'HalfLeave'}>
                  Half Leave
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'FullLeave'}>
                  Full Leave
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <InputLabel id="select-role-label">Summer</InputLabel>
              <Select
                labelId="select-role-label"
                id="select-role"
                value={termPrefs.summer}
                onChange={(event) => handleTerm(event as React.ChangeEvent<HTMLInputElement>, 'summer')}
                sx={{ color: 'black' }}
              >
                <MenuItem sx={{ color: 'black' }} value={'Teaching'}>
                  Teaching
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'NonTeaching'}>
                  Non-teaching
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'HalfLeave'}>
                  Half Leave
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'FullLeave'}>
                  Full Leave
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default SurveyForm;
