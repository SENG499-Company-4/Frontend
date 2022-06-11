export interface Course {
  subject: string;
  code: string;
  term: string;
}

export interface ClassData {
  CourseID: Course;
}

export interface FormValues {
  role: string;
  relief: number;
  explanation: string;
  preferredDays: string[];
  fall: string;
  spring: string;
  summer: string;
  classes: number;
  courses: {
    [key: string]: CourseAbility;
  };
}

export interface CourseAbility {
  ability: string;
  willing: string;
}

export interface TermPrefs {
  fall: string;
  spring: string;
  summer: string;
}
