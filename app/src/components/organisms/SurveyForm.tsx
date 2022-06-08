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
  [key: string]: vals
}

interface vals {
  ability: string;
  willing: string;
}


function SurveyForm(props: { formData: classData[] }) {

  ///const [page, setPage] = useState(0);
  const [currentPageData, setCurrentPageData] = useState(props.formData);
  const [values, setValues] = useState({} as formVals);

  useEffect(() => {
    const upcomingPageData = props.formData;
    setCurrentPageData(upcomingPageData);
    setValues(currentValues => {
      const newValues = upcomingPageData.reduce((obj: any, field) => {
        obj[(field.subject + " " + field.code)] = {
          ability: '',
          willing: ''
        };
        return obj;
      }, {});

      return Object.assign({}, newValues, currentValues);
    });
  }, [props.formData]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(values);
    e.preventDefault();
    // todo - send data somewhere
  };

  const fieldChanged = (courseName: string, type: string, value: string) => {
    console.log("values is")
    console.log(values)
    console.log("and we are attempting to read")
    console.log(courseName)
    setValues(currentValues => {
      currentValues[courseName][type as keyof vals] = value;
      return currentValues;
    });

    // setCurrentPageData(currentPageData => {
    //   return Object.assign({}, currentPageData);
    // });
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
