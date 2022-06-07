import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import SurveyClassQuestion from 'components/organisms/SurveyClassQuestion';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

interface classData {
  subject: string,
  code: string,
  term: string
}

interface formVals {
  course: {
    [key: string]: vals
  };
}

interface vals {
  ability: string;
  willing: string;
}


function SurveyForm(props: { formData: classData[] }) {
  console.log(props.formData);

  const [page, setPage] = useState(0);
  const [currentPageData, setCurrentPageData] = useState(props.formData);
  const [values, setValues] = useState({} as formVals);

  useEffect(() => {
    const upcomingPageData = props.formData;
    setCurrentPageData(upcomingPageData);
    setValues(currentValues => {
      const newValues = upcomingPageData.reduce((obj: formVals, field) => {
        console.log("blah");
        // obj[(field.subject + field.code)] = {
        //   "ability": '',
        //   "willing": ''
        // };
        // return obj;
      }, {});

      return Object.assign({}, newValues, currentValues);
    });
  }, [props.formData]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    // todo - send data somewhere
  };

  const fieldChanged = (courseName: string, type: string, value: string) => {
    setValues(currentValues: any => {
      console.log(currentValues);
      // currentValues.course[courseName] = 1;
      // currentValues.course[courseName][type] = value;
      // return currentValues;
    });

    setCurrentPageData(currentPageData => {
      return Object.assign({}, currentPageData);
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Stack spacing={4}>
          {currentPageData.map(field => {
            return (
              <SurveyClassQuestion name={field.subject + " " + field.code} nameChanged={fieldChanged} />
            );
          })}
          <FormControlLabel control={<Checkbox defaultChecked />} label="Have Relief?" />
          <TextField
            id="outlined-textarea"
            label="Explanation"
            multiline
            style={{ width: 500 }}
            inputProps={{ style: { color: 'black' } }}
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
