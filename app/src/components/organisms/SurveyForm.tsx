import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import SurveyClassQuestion from 'components/organisms/SurveyClassQuestion';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';

interface classData {
  subject: string;
  code: string;
  term: string;
}

interface outerClass {
  CourseID: classData;
}

interface formVals {
  relief: boolean;
  explanation: string;
  courses: {
    [key: string]: vals;
  };
}

interface vals {
  ability: string;
  willing: string;
}

function SurveyForm(props: { formData: outerClass[] }) {
  const [disable, setDisabled] = useState(true);
  const [values, setValues] = useState(() => {
    const currentValues: formVals = {
      relief: false,
      explanation: '',
      courses: {}
    };

    currentValues.courses = props.formData.reduce((obj: any, field) => {
      obj[field.CourseID.subject + ' ' + field.CourseID.code] = {
        ability: '',
        willing: ''
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

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>, checkbox: boolean) => {
    setValues((currentValues) => {
      if (checkbox) {
        currentValues.relief = event.target.checked;
        setDisabled(!disable);
      } else {
        currentValues.explanation = event.target.value;
      }
      return currentValues;
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Stack style={{ height: '500px', overflowY: 'scroll' }} spacing={4}>
          {props.formData.map((field) => {
            return (
              <SurveyClassQuestion
                key={field.CourseID.subject + field.CourseID.code}
                name={field.CourseID.subject + ' ' + field.CourseID.code}
                nameChanged={fieldChanged}
              />
            );
          })}
        </Stack>
        <Divider />
        <Stack spacing={4}>
          <FormControlLabel
            control={<Checkbox />}
            label="Have Relief?"
            onChange={(event) => handleCheckbox(event as React.ChangeEvent<HTMLInputElement>, true)}
          />
          <TextField
            id="Explanation-textarea"
            label="Explanation"
            multiline
            rows={4}
            disabled={disable}
            style={{ width: 500 }}
            inputProps={{ style: { color: 'black' } }}
            onChange={(event) => handleCheckbox(event as React.ChangeEvent<HTMLInputElement>, false)}
          />

          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </div>
  );
}

export default SurveyForm;
