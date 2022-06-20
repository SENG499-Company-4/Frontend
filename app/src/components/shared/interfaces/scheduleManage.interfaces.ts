import { Term } from "../constants/timetable.constants";
import { ICourse } from "./timetable.interfaces";

export interface ISchedule {
  id: number;
  year: number;
  createdAt: Date;
  courses: ICourse[];
  term: Term;
}
