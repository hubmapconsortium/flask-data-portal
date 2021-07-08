import React from 'react';
import Button from '@material-ui/core/Button';
import SectionButtonRow, { BottomAlignedTypography } from './SectionButtonRow';

export default {
  title: 'Sections/SectionButtonRow',
  component: SectionButtonRow,
  parameters: {
    docs: {
      description: {
        component: 'A right aligned button row often used above entity detail sections.',
      },
    },
  },
  argTypes: {
    buttons: {
      control: false,
    },
    leftText: {
      control: false,
    },
  },
};

const Template = (args) => <SectionButtonRow {...args} />;
export const Default = Template.bind({});
Default.args = {
  buttons: ['Right', 'Aligned', 'Buttons'].map((buttonText) => (
    <Button variant="contained" color="primary">
      {buttonText}
    </Button>
  )),
  leftText: <BottomAlignedTypography>Bottom Left Text</BottomAlignedTypography>,
};
