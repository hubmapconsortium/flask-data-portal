import React from 'react';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';

function VerticalChartGridRowsGroup({ children, margin: { left, top }, yScale, xWidth }) {
  return (
    <>
      <GridRows top={top} left={left} scale={yScale} width={xWidth} stroke="black" opacity={0.2} />
      <Group top={top} left={left}>
        {children}
      </Group>
    </>
  );
}

export default VerticalChartGridRowsGroup;
