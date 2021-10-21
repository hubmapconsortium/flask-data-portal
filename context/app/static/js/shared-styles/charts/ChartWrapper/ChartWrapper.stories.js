import React, { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import {
  Basic as BasicVerticalStackedBarChart,
  colorScale,
} from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalStackedBarChart.stories';
import ChartWrapper from './ChartWrapper';

export default {
  title: 'Charts/ChartWrapper',
  component: ChartWrapper,
};

const sharedArgs = {
  margin: BasicVerticalStackedBarChart.args.margin,
  colorScale,
  children: <BasicVerticalStackedBarChart {...BasicVerticalStackedBarChart.args} />,
};

export const Default = (args) => <ChartWrapper {...args} />;

Default.args = { ...sharedArgs, chartTitle: 'Chart With Legend' };

function Container(props) {
  const [chartTitle, setChartTitle] = useState('Chart with Dropdown A');

  function handleChange(event) {
    setChartTitle(event.target.value);
  }

  return (
    <ChartWrapper
      {...props}
      dropdown={
        <Select value={chartTitle} onChange={handleChange} label="Chart Title">
          <MenuItem value="Chart with Dropdown A">Chart with Dropdown A</MenuItem>
          <MenuItem value="Chart with Dropdown B">Chart with Dropdown B</MenuItem>
        </Select>
      }
      chartTitle={chartTitle}
    />
  );
}

export const WithDropdown = (args) => <Container {...args} />;
WithDropdown.args = {
  ...sharedArgs,
};
