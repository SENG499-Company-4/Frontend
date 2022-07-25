import React from 'react';
import { Button } from '@mui/material';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

interface IHeaderButtonProps {
  children?: React.ReactNode;
  label: string;
  url: string;
  icon?: any;
  fullWidth?: boolean;
}

function HeaderButton(props: IHeaderButtonProps) {
  const cookies = new Cookies();
  const navigate = useNavigate();

  function navTo(pageName: string) {
    return () => {
      if (pageName === '/logout') {
        cookies.remove('user');
        window.location.href = '/login';
      } else {
        navigate(pageName);
      }
    };
  }

  return (
    <>
      <Button onClick={navTo(props.url)} fullWidth={props.fullWidth} color="inherit" startIcon={props.icon}>
        {props.label}
      </Button>
    </>
  );
}

export default HeaderButton;
