export interface course {
  subject: string;
  code: string;
  term: string;
}

export interface classData {
  CourseID: course;
}

export interface formVals {
  role: string;
  relief: number;
  explanation: string;
  preferredDays: string[];
  fall: string;
  spring: string;
  summer: string;
  classes: number;
  courses: {
    [key: string]: vals;
  };
}

export interface vals {
  ability: string;
  willing: string;
}
