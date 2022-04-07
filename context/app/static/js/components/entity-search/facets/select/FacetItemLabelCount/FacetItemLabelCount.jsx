import React from 'react';
import Typography from '@material-ui/core/Typography';

import { Flex, FormLabelText } from './style';

function FacetItemLabelCount({ label, count, active, ...rest }) {
  return (
    <Flex {...rest} $active={active}>
      <FormLabelText>{label}</FormLabelText>
      <Typography>{count}</Typography>
    </Flex>
  );
}

export default FacetItemLabelCount;
