import React from 'react';
import PropTypes from 'prop-types';

import { StyledRect } from './style';

function StackedBar({ direction, bar, hoverProps }) {
  const maxBarThickness = 65;

  // props are inversed for vertical and horizontal charts
  const propMap = {
    horizontal: {
      length: 'width',
      thickness: 'height',
      discreteAxis: 'x',
      categoricalAxis: 'y',
    },
    vertical: {
      length: 'height',
      thickness: 'width',
      discreteAxis: 'y',
      categoricalAxis: 'x',
    },
  };

  const { length, thickness, discreteAxis, categoricalAxis } = propMap[direction];

  const dimensionsAndPlacementProps = {
    [length]: bar[length],
    [discreteAxis]: bar[discreteAxis],
    [thickness]: Math.min(bar[thickness], maxBarThickness),
    [categoricalAxis]:
      bar[thickness] > maxBarThickness
        ? bar[categoricalAxis] + (bar[thickness] - maxBarThickness) / 2
        : bar[categoricalAxis],
  };

  return (
    <StyledRect
      fill={bar.color}
      {...dimensionsAndPlacementProps}
      $showHover={Object.keys(hoverProps).length > 0}
      {...hoverProps}
    />
  );
}

StackedBar.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
};

StackedBar.defaultProps = {
  direction: 'vertical',
};

export default StackedBar;
