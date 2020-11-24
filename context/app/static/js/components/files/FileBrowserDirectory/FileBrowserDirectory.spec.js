/* eslint-disable import/no-unresolved */
import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen, fireEvent } from 'test-utils/functions';

import FileBrowserDirectory from './FileBrowserDirectory';

test('displays directory name', () => {
  render(
    <FileBrowserDirectory dirName="fakedir" depth={2}>
      directory child
    </FileBrowserDirectory>,
  );

  expect(screen.getByText('fakedir')).toBeInTheDocument();
});

test('handles click', () => {
  render(
    <FileBrowserDirectory dirName="fakedir" depth={2}>
      directory child
    </FileBrowserDirectory>,
  );

  expect(screen.queryByText('directory child')).toBeNull();
  userEvent.click(screen.getByRole('button'));
  expect(screen.getByText('directory child')).toBeInTheDocument();
});

test('handles key down', () => {
  render(
    <FileBrowserDirectory dirName="fakedir" depth={2}>
      directory child
    </FileBrowserDirectory>,
  );

  expect(screen.queryByText('directory child')).toBeNull();
  fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter', code: 'Enter', keyCode: 13 });
  expect(screen.getByText('directory child')).toBeInTheDocument();
});

test('has correct left padding', () => {
  const depth = 2;
  render(
    <FileBrowserDirectory dirName="fakedir" depth={depth}>
      directory child
    </FileBrowserDirectory>,
  );

  // depth * indentation multiplier * 8px spacing unit + base padding
  const expectedPadding = depth * 1.5 * 8 + 40;

  expect(screen.getByText('fakedir')).toHaveStyle(`padding-left: ${expectedPadding}px`);
});

test('is keyboard focusable', () => {
  render(
    <FileBrowserDirectory dirName="fakedir" depth={2}>
      directory child
    </FileBrowserDirectory>,
  );

  expect(document.body).toHaveFocus();
  userEvent.tab();
  expect(screen.getByRole('button')).toHaveFocus();
});
