import React, { useReducer, useRef } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';

import { OffsetPopper } from './style';

function Dropdown(props) {
  const { title, children } = props;
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  return (
    <>
      <Button ref={anchorRef} onClick={toggle} style={{ color: 'white' }}>
        {title}
        {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </Button>
      <OffsetPopper open={open} anchorEl={anchorRef.current} placement="bottom-start">
        <Paper>
          <ClickAwayListener onClickAway={toggle}>
            <MenuList>{children}</MenuList>
          </ClickAwayListener>
        </Paper>
      </OffsetPopper>
    </>
  );
}

export default Dropdown;
