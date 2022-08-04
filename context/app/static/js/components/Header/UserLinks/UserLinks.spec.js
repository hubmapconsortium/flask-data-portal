/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import userEvent from '@testing-library/user-event';

import UserLinks from './UserLinks';

test('should be "User Profile" when not authenticated', () => {
  render(<UserLinks isAuthenticated={false} />);
  expect(screen.getByText('User Profile')).toBeInTheDocument();
  userEvent.click(screen.getByText('User Profile'));
  // In drop-down:
  expect(screen.getByText('My Lists')).toBeInTheDocument();
  expect(screen.getByText('Log In')).toBeInTheDocument();
  expect(screen.queryByText('Log Out')).toBeNull();
});

test('should be logout button when authenticated', () => {
  render(<UserLinks isAuthenticated userEmail="fake@fake.fake" />);
  expect(screen.getByText('fake@fake.fake')).toBeInTheDocument();
  userEvent.click(screen.getByText('fake@fake.fake'));
  // In drop-down:
  expect(screen.getByText('My Lists')).toBeInTheDocument();
  expect(screen.getByText('Log Out')).toBeInTheDocument();
  expect(screen.queryByText('Log In')).toBeNull();
});

test('should display User when userEmail is empty', () => {
  render(<UserLinks isAuthenticated userEmail="" />);
  expect(screen.getByText('User')).toBeInTheDocument();
});
