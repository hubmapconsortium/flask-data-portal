/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from '@testing-library/react';
import Providers from 'js/components/Providers';

const appProviderEndpoints = {
  elasticsearchEndpoint: 'fakeElasticsearchEndpoint',
  entityEndpoint: 'fakeEntityEndpoint',
  assetsEndpoint: 'fakeAssetsEndpoint',
};

const appProviderToken = 'fakeGroupsToken';

const AllTheProviders = ({ children }) => {
  return (
    <Providers endpoints={appProviderEndpoints} groupsToken={appProviderToken}>
      {children}
    </Providers>
  );
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, appProviderEndpoints, appProviderToken };
