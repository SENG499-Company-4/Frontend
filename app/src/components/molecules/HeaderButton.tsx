import React from 'react';
import { Button } from '@mui/material';
import Cookies from 'universal-cookie';

interface IHeaderButtonProps {
  children?: React.ReactNode;
  label: string;
  url: string;
  icon?: any;
}

function HeaderButton(props: IHeaderButtonProps) {
  const cookies = new Cookies();

  function navTo(pageName: string) {
    return () => {
      if (pageName === '/logout') {
        cookies.remove('user');
        window.location.href = `/`;
      } else {
        window.location.href = `${pageName}`;
      }
    };
  }

  return (
    <>
      <Button onClick={navTo(props.url)} color="inherit" startIcon={props.icon}>
        {props.label}
      </Button>
    </>
  );
}

export default HeaderButton;
