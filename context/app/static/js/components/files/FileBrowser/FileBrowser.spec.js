/* eslint-disable import/no-unresolved */
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'test-utils/functions';

import DetailContext from 'js/components/Detail/context';
import FileBrowser from './FileBrowser';
import FilesContext from '../Files/context';

const fakeOpenDUA = jest.fn();

const uuid = 'fakeuuid';

const FilesProviders = ({ children }) => {
  return (
    <DetailContext.Provider value={{ uuid }}>
      <FilesContext.Provider value={{ openDUA: fakeOpenDUA, hasAgreedToDUA: 'fakedua' }}>
        {children}
      </FilesContext.Provider>
    </DetailContext.Provider>
  );
};

test('displays files and directories', () => {
  const sharedEntries = {
    edam_term: 'faketerm',
    description: 'fakedescription',
    size: 1000,
    type: 'faketype',
  };

  const testFiles = [
    {
      rel_path: 'path1/path2/fake1.txt',
      ...sharedEntries,
    },
    {
      rel_path: 'path1/path2/fake2.txt',
      ...sharedEntries,
    },
    {
      rel_path: 'path1/fake3.txt',
      ...sharedEntries,
    },
    {
      rel_path: 'path3/fake4.txt',
      ...sharedEntries,
    },
    {
      rel_path: 'fake5.txt',
      ...sharedEntries,
    },
  ];

  render(
    <FilesProviders>
      <FileBrowser files={testFiles} />
    </FilesProviders>,
  );

  const textInDocumentBeforeOpenDirectory = ['path1', 'path3', 'fake5.txt'];
  textInDocumentBeforeOpenDirectory.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  const textNotInDocumentBeforeOpenDirectory = ['path2', 'fake1.txt', 'fake2.txt', 'fake3.txt', 'fake4.txt'];
  textNotInDocumentBeforeOpenDirectory.forEach((text) => expect(screen.queryByText(text)).toBeNull());

  userEvent.click(screen.getByRole('button', { name: 'path1' }));

  const textInDocumentAfterOpenDirectory = [...textInDocumentBeforeOpenDirectory, 'fake3.txt', 'path2'];
  textInDocumentAfterOpenDirectory.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
