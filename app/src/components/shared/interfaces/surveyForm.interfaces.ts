export interface course {
  subject: string;
  code: string;
  term: string;
}

export interface classData {
  CourseID: course;
}

export interface formVals {
  relief: boolean;
  explanation: string;
  courses: {
    [key: string]: vals;
  };
}

export interface vals {
  ability: string;
  willing: string;
}
