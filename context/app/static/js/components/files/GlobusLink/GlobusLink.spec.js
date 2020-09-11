/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen, appProviderEndpoints } from 'test-utils/functions';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import GlobusLink from './GlobusLink';

const uuid = 'fakeuuid';
const display_doi = 'fakedoi';

const globusUrlResponse = {
  url: 'fakeglobusurl',
};

const server = setupServer(
  rest.get(`/${appProviderEndpoints.entityEndpoint}/entities/dataset/globus-url/${uuid}`, (req, res, ctx) => {
    return res(ctx.json(globusUrlResponse), ctx.status(200));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays progress bar when loading and success icon with 200 response', async () => {
  render(<GlobusLink uuid={uuid} display_doi={display_doi} />);

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  await screen.findByText('Bulk Data Transfer');
  expect(screen.getByTestId('success-icon')).toBeInTheDocument();
});

test('displays info icon with 500 response', async () => {
  server.use(
    rest.get(`/${appProviderEndpoints.entityEndpoint}/entities/dataset/globus-url/${uuid}`, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  render(<GlobusLink uuid={uuid} display_doi={display_doi} />);

  await screen.findByText('Bulk Data Transfer');
  expect(screen.getByTestId('error-icon')).toBeInTheDocument();
});
