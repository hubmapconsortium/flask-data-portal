import React from 'react';
import { AggregationsTermsAggregateBase } from '@elastic/elasticsearch/lib/api/types';
import esb from 'elastic-builder';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { useAppContext } from 'js/components/Contexts';
import { SearchStoreProvider, useSearchStore, SearchStoreState } from './store';
import { HitDoc } from './types';
import Results from './Results';
import { getPortalESField } from './buildTypesMap';
import Facets from './Facets/Facets';
import SearchBar from './SearchBar';
import { useScrollSearchHits } from './useScrollSearchHits';

function buildQuery({
  terms,
  hierarchicalTerms,
  size,
  search,
  searchFields,
  sourceFields,
  sortField,
}: Omit<SearchStoreState, 'endpoint' | 'swrConfig'>) {
  const query = esb
    .requestBodySearch()
    .size(size)
    .source(sourceFields.length ? sourceFields : false)
    .sort(esb.sort(getPortalESField(sortField.field), sortField.direction));

  if (search.length) {
    query.query(esb.simpleQueryStringQuery(search).fields(searchFields)).highlight(esb.highlight(searchFields));
  }

  Object.entries(terms).forEach(([field, values]) => {
    const portalField = getPortalESField(field);
    if (values.size) {
      query.postFilter(esb.termsQuery(portalField, [...values]));
    }
    query.agg(esb.termsAggregation(field, portalField));
  });

  Object.entries(hierarchicalTerms).forEach(([field, { values, childField }]) => {
    if (!childField) {
      return;
    }
    const parentPortalField = getPortalESField(field);
    const childPortalField = getPortalESField(childField);

    if (Object.keys(values).length) {
      query.postFilter(esb.termsQuery(parentPortalField, Object.keys(values)));

      const childValues = Object.values(values)
        .map((v) => [...v])
        .flat();
      query.postFilter(esb.termsQuery(childPortalField, childValues));
    }
    query.agg(esb.termsAggregation(field, parentPortalField).agg(esb.termsAggregation(childField, childPortalField)));
  });

  return query.toJSON();
}

interface Bucket {
  key: string;
  doc_count: number;
}

type Aggregations = Record<
  string,
  AggregationsTermsAggregateBase<Bucket & Partial<Record<string, AggregationsTermsAggregateBase<Bucket>>>>
>;

export function useSearch() {
  const { endpoint, swrConfig = {}, ...rest }: SearchStoreState = useSearchStore();

  const query = buildQuery({ ...rest });

  return useScrollSearchHits<HitDoc, Aggregations>({ query, endpoint, swrConfig });
}

interface HierarchicalTerm {
  field: string;
  childField: string;
}

interface Facets {
  terms?: string[];
  hierarchicalTerms?: HierarchicalTerm[];
}

function buildTerms({ terms }: Required<Pick<Facets, 'terms'>>) {
  return terms.reduce<Record<string, Set<string>>>((acc, curr) => {
    const copy = acc;
    copy[curr] = new Set([]);
    return copy;
  }, {});
}

function buildHierachicalTerms({ hierarchicalTerms }: Required<Pick<Facets, 'hierarchicalTerms'>>) {
  return hierarchicalTerms.reduce<Record<string, { values: Record<string, never>; childField: string }>>(
    (acc, curr) => {
      const copy = acc;
      copy[curr.field] = { values: {}, childField: curr.childField };
      return copy;
    },
    {},
  );
}

type SearchConfig = Pick<
  SearchStoreState,
  'searchFields' | 'sourceFields' | 'endpoint' | 'swrConfig' | 'sortField' | 'size'
> & {
  facets: Facets;
};

function buildInitialSearchState({
  facets: { terms = [], hierarchicalTerms = [] },
  swrConfig = {},
  ...rest
}: SearchConfig) {
  return {
    search: '',
    terms: buildTerms({ terms }),
    hierarchicalTerms: buildHierachicalTerms({ hierarchicalTerms }),
    swrConfig,
    ...rest,
  };
}

function Search() {
  return (
    <Stack direction="column" spacing={2} mb={2}>
      <SearchBar />
      <Stack direction="row" spacing={2}>
        <Facets />
        <Box flexGrow={1}>
          <Results />
        </Box>
      </Stack>
    </Stack>
  );
}

const c = {
  searchFields: ['all_text', 'description'],
  // TODO: figure out how to make assertion unnecessary.
  sortField: { field: 'last_modified_timestamp', direction: 'desc' as const },
  sourceFields: [
    'hubmap_id',
    'group_name',
    'assay_display_name',
    'origin_samples.mapped_organ',
    'mapped_status',
    'last_modified_timestamp',
  ],
  facets: {
    terms: ['entity_type'],
    hierarchicalTerms: [{ field: 'dataset_type', childField: 'assay_display_name' }],
  },
  size: 10,
};

function SearchWrapper({ config }: { config: Omit<SearchConfig, 'endpoint'> }) {
  const { elasticsearchEndpoint } = useAppContext();

  return (
    <SearchStoreProvider initialState={buildInitialSearchState({ ...config, endpoint: elasticsearchEndpoint })}>
      <Search />
    </SearchStoreProvider>
  );
}

function DatasetsSearch() {
  return <SearchWrapper config={c} />;
}

export default DatasetsSearch;
