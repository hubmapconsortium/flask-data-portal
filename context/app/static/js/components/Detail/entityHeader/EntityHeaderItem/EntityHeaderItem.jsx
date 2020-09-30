import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { VerticalDivider } from './style';

function EntityHeaderItem({ text }) {
  return (
    <>
      <Typography variant="body1">{text}</Typography>
      <VerticalDivider orientation="vertical" flexItem />
    </>
  );
}

EntityHeaderItem.propTypes = {
  text: PropTypes.string,
};

EntityHeaderItem.defaultProps = {
  text: undefined,
};

export default EntityHeaderItem;
