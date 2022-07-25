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
  setTerm: (term: Term) => void;
  setYear: (year: Date) => void;
}

export const TermSelectorContext = React.createContext<ITermSelectorState>({
  term: getCurrentTerm(),
  year: new Date(),
  currentTerm: getCurrentTerm(),
  firstMondayOfTerm: new Date(),
  setTerm: (term: Term) => {
    console.log('TermSelectorContext | Setting term to ', term);
  },
  setYear: (year: Date) => {
    console.log('TermSelectorContext | Setting year to ', year);
  }
});

export const TermSelectorContextProvider: React.FC<ITermSelectorContextProps> = (props: ITermSelectorContextProps) => {
  const [term, setTerm] = useState<Term>(getCurrentTerm());
  const [year, setYear] = useState<Date>(new Date());
  const [currentTerm] = useState<Term>(getCurrentTerm());
  const [firstMondayOfTerm, setFirstMondayOfTerm] = useState<Date>(getCourseStartDate(year.getFullYear(), term));

  React.useEffect(() => {
    setFirstMondayOfTerm(getCourseStartDate(year.getFullYear(), term));
  }, [term, year]);

  return (
    <TermSelectorContext.Provider
      value={{
        term,
        year,
        currentTerm,
        firstMondayOfTerm,
        setTerm,
        setYear
      }}
    >
      {props.children}
    </TermSelectorContext.Provider>
  );
};
