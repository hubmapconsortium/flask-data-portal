import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { Flex } from './style';

function SectionButtonRow({ leftText, buttons, ...props }) {
  return (
    <Flex {...props}>
      {leftText || <div />}
      <div>{buttons}</div>
    </Flex>
  );
}

SectionButtonRow.propTypes = {
  /**
   Text to be displayed in the left most available space. Usually a BottomAlignedTypography component.
  */
  leftText: PropTypes.element.isRequired,
  /**
   Button(s) to be displayed in the right most available space.
  */
  buttons: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element, PropTypes.bool]).isRequired,
};

const SpacedSectionButtonRow = styled(SectionButtonRow)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
  min-height: 40px;
`;

const BottomAlignedTypography = styled(Typography)`
  align-self: flex-end;
`;

export { SpacedSectionButtonRow, BottomAlignedTypography };
export default SectionButtonRow;
