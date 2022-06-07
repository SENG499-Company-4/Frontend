import React from 'react';
import SurveyForm from 'components/organisms/SurveyForm';


function Survey() {
  return (
    <div>
      <SurveyForm formData={classData} />
      {/* input some data with that call */}
    </div>
  );
}

const classData = [
  { "subject": "CSC", "code": "105", "term": "SPRING" },
  { "subject": "CSC", "code": "106", "term": "SPRING" },
  { "subject": "SENG", "code": "310", "term": "SPRING" },
  { "subject": "SENG", "code": "265", "term": "SPRING" },
  { "subject": "SENG", "code": "275", "term": "SPRING" },
  { "subject": "CSC", "code": "116", "term": "SPRING" }
]


export default Survey;
