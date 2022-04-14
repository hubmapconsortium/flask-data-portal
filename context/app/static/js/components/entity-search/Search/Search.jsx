import React, { useContext, useMemo } from 'react';

import { MultiMatchQuery } from '@searchkit/sdk';
import { useSearchkitVariables } from '@searchkit/client';

import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createSearchkitFacet } from 'js/components/entity-search/SearchWrapper/utils';
import useSearchkitSDK from 'js/components/entity-search/searchkit-modifications/useSearchkitSDK';
import ResultsTable from 'js/components/entity-search/ResultsTable';
import RequestTransporter from 'js/components/entity-search/searchkit-modifications/RequestTransporter';
import Facets from 'js/components/entity-search/facets/Facets';
import { SearchLayout, SidebarLayout, ResultsLayout } from './style';

function Search() {
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const authHeader = getAuthHeader(groupsToken);
  const { fields, facets, filters } = useStore();

  const config = useMemo(
    () => ({
      host: elasticsearchEndpoint,
      connectionOptions: {
        headers: {
          ...authHeader,
        },
      },
      hits: {
        fields: Object.values(fields).map(({ identifier }) => identifier),
      },
      sortOptions: Object.values(fields)
        .map((field) => [
          {
            id: `${field.field}.asc`,
            label: field.label,
            field: { [field.field]: 'asc' },
          },
          {
            id: `${field.field}.desc`,
            label: field.label,
            field: { [field.field]: 'desc' },
          },
        ])
        .flat(),
      query: new MultiMatchQuery({
        fields: ['all_text'],
      }),
      facets: Object.values(facets).map((facet) => createSearchkitFacet(facet)),
      filters: filters.map((filter) => filter.definition),
    }),
    [authHeader, elasticsearchEndpoint, facets, fields, filters],
  );

  const transporter = new RequestTransporter(config);

  const variables = useSearchkitVariables();
  const { results } = useSearchkitSDK(config, variables, transporter, filters);

  return (
    <SearchLayout>
      <SidebarLayout>{results?.facets && <Facets resultsFacets={results.facets} />}</SidebarLayout>
      <ResultsLayout>{results?.hits && <ResultsTable hits={results.hits} />}</ResultsLayout>
    </SearchLayout>
  );
}

export default Search;
