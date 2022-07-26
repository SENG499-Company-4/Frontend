import { getCourseStartDate, getCurrentTerm } from 'utils/utils';
import * as React from 'react';
import { useState } from 'react';
import { Term } from 'types/api.types';

interface ITermSelectorContextProps {
  children?: React.ReactNode;
}

export interface ITermSelectorState {
  term: Term;
  year: Date;
  currentTerm: Term;
  firstMondayOfTerm: Date;
  professorIdFilter?: number;
  courseIdFilter?: string;
  setProfessorIdFilter: (professorId: number) => void;
  setCourseIdFilter: (courseId: string) => void;
  setTerm: (term: Term) => void;
  setYear: (year: Date) => void;
}

export const TermSelectorContext = React.createContext<ITermSelectorState>({
  term: getCurrentTerm(),
  year: new Date(),
  currentTerm: getCurrentTerm(),
  firstMondayOfTerm: new Date(),
  professorIdFilter: -1,
  courseIdFilter: '',
  setProfessorIdFilter: () => {},
  setCourseIdFilter: () => {},
  setTerm: () => {},
  setYear: () => {}
});

export const TermSelectorContextProvider: React.FC<ITermSelectorContextProps> = (props: ITermSelectorContextProps) => {
  const [term, setTerm] = useState<Term>(getCurrentTerm());
  const [year, setYear] = useState<Date>(new Date());
  const [currentTerm] = useState<Term>(getCurrentTerm());
  const [firstMondayOfTerm, setFirstMondayOfTerm] = useState<Date>(getCourseStartDate(year.getFullYear(), term));
  const [professorIdFilter, setProfessorIdFilter] = useState<number>(-1);
  const [courseIdFilter, setCourseIdFilter] = useState<string>('');

  React.useEffect(() => {
    setFirstMondayOfTerm(getCourseStartDate(year.getFullYear(), term));
  }, [term, year]);

  React.useEffect(() => {
    console.log('Filters changed.');
    console.log('professorIdFilter: ' + professorIdFilter);
    console.log('courseIdFilter: ' + courseIdFilter);
  }, [[professorIdFilter, courseIdFilter]]);

  return (
    <TermSelectorContext.Provider
      value={{
        term,
        year,
        currentTerm,
        firstMondayOfTerm,
        professorIdFilter,
        courseIdFilter,
        setProfessorIdFilter,
        setCourseIdFilter,
        setTerm,
        setYear
      }}
    >
      {props.children}
    </TermSelectorContext.Provider>
  );
};
