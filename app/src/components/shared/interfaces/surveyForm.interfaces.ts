export interface ICourse {
  subject: string;
  code: string;
  term: string;
}

export interface IClassData {
  CourseID: ICourse;
}

export interface IFormValues {
  role: string;
  relief: number;
  explanation: string;
  topicsCourse: boolean;
  topicsCourseTitle: string;
  topicsCourseDesc: string;
  preferredDays: string[];
  fall: string;
  spring: string;
  summer: string;
  classes: number;
  courses: {
    [key: string]: ICourseAbility;
  };
}

export interface ICourseAbility {
  ability: string;
  willing: string;
}

export interface ITermPrefs {
  fall: string;
  spring: string;
  summer: string;
}
