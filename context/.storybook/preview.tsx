import React from 'react';

import Providers from '../app/static/js/components/Providers';
import { initialize,  mswLoader } from 'msw-storybook-addon';
import { enableMapSet } from 'immer';


import '@fontsource-variable/inter/files/inter-latin-standard-normal.woff2';

enableMapSet();

const allowConditions = [(url) => String(url).endsWith('thumbnail.jpg')];
initialize({
  serviceWorker: {
    options: {
      updateViaCache: 'none'
    }
  }
});
export const loaders = [mswLoader]

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const mockEndpoints = { assetsEndpoint: 'https://assets.hubmapconsortium.org', softAssayEndpoint: '/soft-assay-endpoint', elasticsearchEndpoint: '/search' };
export const mockGroupsToken = '';

export const decorators = [
  (Story) => (
    <Providers endpoints={mockEndpoints} groupsToken={mockGroupsToken} isAuthenticated={false} userEmail={'undefined'} workspacesToken={'undefined'} isWorkspacesUser={false} isHubmapUser={false} flaskData={{}}>
      <Story />
    </Providers>
  ),
];
export const tags = ['autodocs'];


const preview = {
  parameters,
  loaders,
  decorators,
}

export default preview