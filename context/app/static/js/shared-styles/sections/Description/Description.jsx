import React from 'react';
import Typography from '@material-ui/core/Typography';

import { StyledPaper, StyledInfoIcon } from './style';

function Description({ padding, children, ...props }) {
  return (
    <StyledPaper $padding={padding} {...props}>
      <StyledInfoIcon color="primary" />
      <Typography variant="body1">{children}</Typography>
    </StyledPaper>
  );
}

export default Description;
