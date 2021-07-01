import React from 'react';

import { Default as DefaultCitation } from 'js/components/Detail/Citation/Citation.stories';
import SummaryBody from './SummaryBody';

export default {
  title: 'EntityDetail/Summary/SummaryBody',
  component: SummaryBody,
};

const sharedArgs = {
  create_timestamp: Date.now(),
  last_modified_timestamp: Date.now(),
};

const description =
  'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.';

const Template = (args) => <SummaryBody {...args} />;
export const Default = Template.bind({});
Default.args = sharedArgs;

export const WithDescription = Template.bind({});
WithDescription.args = {
  ...sharedArgs,
  description,
};

export const WithCitation = Template.bind({});
WithCitation.args = {
  ...sharedArgs,
  description,
  ...DefaultCitation.args,
};

export const WithCollectionName = Template.bind({});
WithCollectionName.args = {
  ...sharedArgs,
  description,
  collectionName: 'Fake Collection Name',
};
