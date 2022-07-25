import React, { ReactNode } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import HeaderButton from './HeaderButton';

interface IHeaderMenuProps {
  children: React.ReactNode;
  label: string;
  icon?: any;
}

function HeaderMenu(props: IHeaderMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open: boolean = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button color="inherit" onClick={handleClick} startIcon={props.icon}>
        {props.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {React.Children.map(props.children, (child: ReactNode) => {
          return child ? <MenuItem sx={{ padding: 0, margin: 1 }}>{React.cloneElement(child as React.ReactElement<any>, { fullWidth: true })}</MenuItem> : null;

        })}
      </Menu>
    </>
  );
}

export default HeaderMenu;
