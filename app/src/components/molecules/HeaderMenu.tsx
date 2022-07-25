import React, { ReactNode } from 'react';
import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';

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
      <ButtonBase onClick={handleClick} sx={{ padding: '15px' }}>
        {props.icon}
        <Typography variant="button" ml={1}>
          {props.label}
        </Typography>
      </ButtonBase>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        style={{ padding: 0, margin: 0 }}
      >
        {React.Children.map(props.children, (child: ReactNode) => {
          return child ? <MenuItem style={{ padding: 0, margin: 0 }}>{child}</MenuItem> : null;
        })}
      </Menu>
    </>
  );
}

export default HeaderMenu;
