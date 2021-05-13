import React from 'react';
import Button from '@material-ui/core/Button';
import { sendOutboundEvent } from './OutboundLink';
import { StyledOpenInNewRoundedIcon } from './style';

function OutboundLinkButton({ children, ...props }) {
  return (
    <Button
      {...props}
      color="primary"
      variant="contained"
      component="a"
      target="_blank"
      rel="noopener noreferrer"
      onClick={sendOutboundEvent}
    >
      {children} <StyledOpenInNewRoundedIcon />
    </Button>
  );
}

export default OutboundLinkButton;
