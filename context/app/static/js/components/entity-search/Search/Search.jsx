import React from 'react';

import { SearchkitClient, withSearchkit, withSearchkitRouting } from '@searchkit/client';

import { routeToStateWithDefaultPageSize } from 'js/components/entity-search/searchkit-modifications/routeToState';

import Sidebar from 'js/components/entity-search/sidebar/Sidebar';
import SearchBar from 'js/components/entity-search/SearchBar';
import FacetChips from 'js/components/entity-search/facets/facetChips/FacetChips';
import MetadataMenu from 'js/components/entity-search/MetadataMenu/';
import SearchViewSwitch from 'js/components/entity-search/results/SearchViewSwitch';
import Results from 'js/components/entity-search/results/Results';
import { Flex, Grow } from './style';
import { useSearch } from './hooks';

const defaultPageSize = 18;

const routeToState = routeToStateWithDefaultPageSize(defaultPageSize);

const createSkClient = () =>
  new SearchkitClient({
    itemsPerPage: defaultPageSize,
  });

function Search() {
  const { results, allResultsUUIDs, entityType } = useSearch();
  return (
    <>
      <Flex>
        <Grow>
          <SearchBar />
        </Grow>
        <MetadataMenu allResultsUUIDs={allResultsUUIDs} entityType={entityType} />
        <SearchViewSwitch />
      </Flex>
      {results?.summary.appliedFilters && <FacetChips appliedFilters={results.summary.appliedFilters} />}
      <Flex>
        <Sidebar results={results} />
        <Results results={results} />
      </Flex>
    </>
  );
}

export default withSearchkit(withSearchkitRouting(Search, { routeToState }), createSkClient);
