import React from 'react';
import { Button } from '@mui/material';

interface HeaderButtonProps {
  children?: React.ReactNode;
  label: string;
  url: string;
  icon?: any;
}

function HeaderButton(props: HeaderButtonProps) {
  console.log('Type of icon: ', typeof props.icon);
  function navTo(pageName: string) {
    return () => {
      window.location.href = `${pageName}`;
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
