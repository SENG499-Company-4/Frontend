import React from 'react';
import { ButtonBase, Typography } from '@mui/material';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

interface IHeaderButtonProps {
  children?: React.ReactNode;
  label: string;
  url: string;
  icon?: any;
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
    <ButtonBase onClick={navTo(props.url)} sx={{ padding: '15px' }}>
      {props.icon}
      <Typography variant="button" ml={1}>
        {props.label}
      </Typography>
    </ButtonBase>
  );
}

export default HeaderButton;
