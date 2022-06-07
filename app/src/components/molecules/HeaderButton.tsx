import React from 'react';
import { Button } from '@mui/material';

interface HeaderButtonProps {
  children?: React.ReactNode;
  label: string;
  url: string;
}

function HeaderButton(props: HeaderButtonProps) {
  function navTo(pageName: string) {
    return () => {
      window.location.href = `${pageName}`;
    };
  }

  return (
    <Button onClick={navTo(props.url)} color="inherit">
      {props.label}
    </Button>
  );
}

export default HeaderButton;

