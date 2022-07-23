import React, { useContext, useEffect, useState } from 'react';
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
import { ICourseAbility } from 'interfaces/surveyForm.interfaces';
import { overallDefaults, ability, willing } from 'constants/surveyForm.constants';
import { externalCodes } from 'constants/courses.constants';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SUBMIT_SURVEY } from 'api/Mutations';
import { LoadingContext } from 'contexts/LoadingContext';
import { ErrorContext } from 'contexts/ErrorContext';
import { CoursePreferenceInput, CreateTeachingPreferenceInput, Term } from 'types/api.types';
import Cookie from 'universal-cookie';
import { calculateCourseRating } from 'utils/utils';
import { Co2Sharp } from '@mui/icons-material';

function SurveyForm(props: { formData: string[] }) {
  const [disable, setDisabled] = useState(true);
  const [topic, setTopic] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [numSummerCourses, setNumSummerCourses] = useState(0);
  const [numSpringCourses, setNumSpringCourses] = useState(0);
  const [numFallCourses, setNumFallCourses] = useState(0);
  const [topicCourse, setTopicCourse] = useState('SENG 480');

  const navigate = useNavigate();
  const cookie = new Cookie();

  const loadingContext = useContext(LoadingContext);
  const errorContext = useContext(ErrorContext);
  const [submitSurvey, { data: submitData, loading: submitLoading, error: submitError }] = useMutation(SUBMIT_SURVEY);

  const [courseAbilities, setCourseAbilities] = useState<any>(() => {
    const abilities = props.formData.reduce((obj: any, code: string) => {
      if (!externalCodes.includes(code)) {
        const codeSplit = code.split(/([0-9]+)/);
        obj[codeSplit[0] + ' ' + codeSplit[1]] = {
          ...overallDefaults
        };
      }
      return obj;
    }, {});
    return abilities;
  });

  const parseAbilities = (): CoursePreferenceInput[] => {
    const coursePreferences: CoursePreferenceInput[] = [];
    const entries = Object.entries(courseAbilities);
    entries.forEach((entry) => {
      const courseCode: string = entry[0];
      const courseAbility: ICourseAbility = entry[1] as ICourseAbility;
      const rating = calculateCourseRating(courseAbility.ability as ability, courseAbility.willing as willing);
      const springCoursePreference: CoursePreferenceInput = {
        subject: courseCode.split(' ')[0],
        code: courseCode.split(' ')[1],
        term: Term.Spring,
        preference: rating
      };
      const summerCoursePreference: CoursePreferenceInput = {
        subject: courseCode.split(' ')[0],
        code: courseCode.split(' ')[1],
        term: Term.Summer,
        preference: rating
      };
      const fallCoursePreference: CoursePreferenceInput = {
        subject: courseCode.split(' ')[0],
        code: courseCode.split(' ')[1],
        term: Term.Fall,
        preference: rating
      };
      coursePreferences.push(springCoursePreference, summerCoursePreference, fallCoursePreference);
    });
    return coursePreferences;
  };

  const parseTopics = (): CoursePreferenceInput[] => {
    if (topic) {
      const topicPreference: CoursePreferenceInput = {
        subject: topicCourse.split(' ')[0],
        code: topicCourse.split(' ')[1],
        term: Term.Fall,
        preference: 6
      };
      return [topicPreference];
    }
    return [];
  };

  const getCourses = () => {
    let abilities = parseAbilities();
    let topics = parseTopics();
    return abilities.concat(topics);
  };

  const [values, setValues] = useState<CreateTeachingPreferenceInput>(() => {
    const currentValues: CreateTeachingPreferenceInput = {
      courses: parseAbilities(),
      fallTermCourses: 0,
      springTermCourses: 0,
      summerTermCourses: 0,
      hasRelief: false,
      hasTopic: false,
      nonTeachingTerm: Term.Fall,
      peng: false,
      reliefReason: '',
      topicDescription: '',
      userId: cookie.get('user').userId
    };
    return currentValues;
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setValues((currentValues) => {
      currentValues = {
        courses: getCourses(),
        fallTermCourses: numFallCourses,
        springTermCourses: numSpringCourses,
        summerTermCourses: numSummerCourses,
        hasRelief: currentValues.hasRelief,
        hasTopic: currentValues.hasTopic,
        nonTeachingTerm: currentValues.nonTeachingTerm,
        peng: false,
        reliefReason: currentValues.reliefReason,
        topicDescription: currentValues.topicDescription,
        userId: currentValues.userId
      };
      return currentValues;
    });
    e.preventDefault();
    const variables = { input: values };
    submitSurvey({ variables });
  };

  useEffect(() => {
    loadingContext.setLoading(submitLoading);
    if (submitData) {
      console.log('Submitted successfully!', submitData);
      setFormSubmitted(true);
    }
    if (submitError) {
      const errorCode = submitError.graphQLErrors.length > 0 ? submitError.graphQLErrors[0].extensions.code : 400;
      const errorMessage = submitError.graphQLErrors.length > 0 ? submitError.graphQLErrors[0].message : '';
      errorContext.setErrorDialog({
        code: errorCode,
        message: 'Schedule generation failed. Please try again.' + errorMessage,
        namespace: 'graphql'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitData, submitLoading, submitError]);

  const fieldChanged = (courseName: string, type: string, value: string) => {
    setCourseAbilities((abilities: any) => {
      abilities[courseName][type as keyof ICourseAbility] = value;
      return abilities;
    });
  };

  const handleRelief = (event: React.ChangeEvent<HTMLInputElement>, amount: boolean) => {
    setValues((currentValues) => {
      if (amount) {
        const reliefAmount = Math.min(Math.max(Number(event.target.value), 0), 6);
        currentValues.hasRelief = reliefAmount > 0 ? true : false;
        // event.currentTarget.value = String(reliefAmount);
        if (reliefAmount > 0) {
          setDisabled(false);
        } else {
          setDisabled(true);
        }
      } else {
        currentValues.reliefReason = event.target.value;
      }
      return currentValues;
    });
  };

  const handleTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((currentValues) => {
      currentValues.topicDescription = event.target.value;
      return currentValues;
    });
  };

  const handleTopicCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.checked);
    setValues((currentValues) => {
      currentValues.hasTopic = event.target.checked;
      return currentValues;
    });
  };

  return (
    <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={formSubmitted}
        onClose={() => {
          setFormSubmitted(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">Success!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your survey has been submitted successfully. Check back at a later date to see your schedule.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigate('/');
            }}
          >
            Back to home
          </Button>
        </DialogActions>
      </Dialog>
      <form onSubmit={onSubmit}>
        <Stack direction="row">
          <Typography variant="overline" gutterBottom sx={{ width: '30%' }}>
            Course
          </Typography>
          <Typography variant="overline" gutterBottom sx={{ width: '50%' }}>
            Ability
          </Typography>
          <Typography variant="overline" gutterBottom sx={{ width: '30%' }}>
            Willingness
          </Typography>
        </Stack>
        <Stack
          sx={{
            height: `calc(50vh)`,
            overflowY: 'scroll',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderBottom: '0',
            paddingTop: '1rem'
          }}
          spacing={2}
        >
          {Object.keys(courseAbilities).map((field) => {
            return (
              <Box key={field}>
                <SurveyClassQuestion
                  additionalQualifications={false}
                  key={field}
                  name={field}
                  fieldChanged={fieldChanged}
                />
              </Box>
            );
          })}
        </Stack>
        <Divider sx={{ marginBottom: '20px' }} />
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <FormGroup>
              <FormControlLabel
                style={{ width: 'auto', minWidth: '335px', marginLeft: '0px', marginTop: '5px' }}
                control={<Checkbox />}
                label="Would you like to teach a topics course?"
                labelPlacement="start"
                onChange={(event) => handleTopicCheck(event as React.ChangeEvent<HTMLInputElement>)}
              />
            </FormGroup>
            <FormControl>
              <InputLabel id="select-topic-label">Department</InputLabel>
              <Select
                labelId="select-topic-label"
                label="Which department"
                id="select-department"
                value={topicCourse}
                disabled={!topic}
                sx={{ color: 'black' }}
                onChange={(event) => setTopicCourse((event as React.ChangeEvent<HTMLInputElement>).target.value)}
              >
                <MenuItem sx={{ color: 'black' }} value={'SENG 480'}>
                  SENG 480
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'CSC 482'}>
                  CSC 482
                </MenuItem>
                <MenuItem sx={{ color: 'black' }} value={'ECE 496'}>
                  ECE 496
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="topics-title-textarea"
              label="Topics course description"
              disabled={!topic}
              style={{ width: '40%' }}
              inputProps={{ style: { color: 'black' } }}
              onChange={(event) => handleTopic(event as React.ChangeEvent<HTMLInputElement>)}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              id="Relief Amount"
              label="Relief Amount (Days)"
              type="number"
              defaultValue={0}
              inputProps={{ style: { color: 'black' } }}
              onChange={(event) => handleRelief(event as React.ChangeEvent<HTMLInputElement>, true)}
            />

            <TextField
              id="Explanation-textarea"
              label="Explanation for relief"
              multiline
              maxRows={4}
              disabled={disable}
              style={{ width: '100%' }}
              inputProps={{ style: { color: 'black' } }}
              onChange={(event) => handleRelief(event as React.ChangeEvent<HTMLInputElement>, false)}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <InputLabel sx={{ marginTop: '10px', marginRight: '5px' }} id="Preferred-days-label">
              Number of courses you wish to teach
            </InputLabel>
            <FormControl>
              <InputLabel id="fall-select-label">{'Fall'}</InputLabel>
              <Select
                labelId="fall-select-label"
                label={'Fall'}
                id="select-fall"
                value={numFallCourses}
                onChange={(event) => {
                  setNumFallCourses(event.target.value as number);
                }}
                sx={{ width: '200px' }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => {
                  return (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="spring-select-label">{'Spring'}</InputLabel>
              <Select
                labelId="spring-select-label"
                label={'Spring'}
                id="select-spring"
                value={numSpringCourses}
                onChange={(event) => {
                  setNumSpringCourses(event.target.value as number);
                }}
                sx={{ width: '200px' }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => {
                  return (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="summer-select-label">{'Summer'}</InputLabel>
              <Select
                labelId="summer-select-label"
                label={'Summer'}
                id="select-summer"
                value={numSummerCourses}
                onChange={(event) => {
                  setNumSummerCourses(event.target.value as number);
                }}
                sx={{ width: '200px' }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => {
                  return (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  );
                })}
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
