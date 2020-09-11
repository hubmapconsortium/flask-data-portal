/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import ProvAnalysisDetails from './ProvAnalysisDetails';

test('should display ingest and cwl lists', () => {
  const dagListData = [
    { origin: 'https://github.com/fake1/fake1.git', hash: 'aaaaaaa' },
    { origin: 'https://github.com/fake2/fake2.git', hash: 'bbbbbbb' },
    { origin: 'https://github.com/fake3/fake3.git', hash: 'ccccccc', name: 'fake3.cwl' },
  ];
  render(<ProvAnalysisDetails dagListData={dagListData} />);

  expect(screen.getByText('Ingest Pipelines')).toBeInTheDocument();
  expect(screen.getByText('CWL Pipelines')).toBeInTheDocument();

  expect(screen.getByTestId('Ingest').children).toHaveLength(2);
  expect(screen.getByTestId('CWL').children).toHaveLength(1);
});
