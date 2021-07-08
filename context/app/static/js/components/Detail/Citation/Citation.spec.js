/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import { composeStories } from '@storybook/testing-react';

import { buildNLMCitation } from './Citation';
import * as stories from './Citation.stories';

const { Citation } = composeStories(stories);

const defaultCitation = 'Aanders A, Banders B, Canders C. Something Science-y [Internet]. HuBMAP Consortium; 2018.';

test('builds NLM citation', () => {
  const { contributors, citationTitle, create_timestamp } = Citation.args;
  expect(buildNLMCitation({ contributors, citationTitle, create_timestamp })).toEqual(defaultCitation);
});

test('Displays correct text', () => {
  render(<Citation />);
  const {
    args: { doi, doi_url },
  } = Citation;
  expect(screen.getByText((content) => content.startsWith(defaultCitation))).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'View DataCite Page' })).toHaveAttribute(
    'href',
    `https://search.datacite.org/works/${doi}`,
  );
  expect(screen.getByRole('link', { name: doi_url })).toHaveAttribute('href', doi_url);
});
