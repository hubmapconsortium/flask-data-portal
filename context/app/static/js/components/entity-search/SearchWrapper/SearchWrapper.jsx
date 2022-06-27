import React from 'react';

import Search from 'js/components/entity-search/Search';
import { getDefaultFilters } from 'js/components/entity-search/searchkit-modifications/getDefaultFilters';
import {
  mergeObjects,
  getDonorMetadataFields,
  createAffiliationFacet,
  createField,
  getEntityTypeFilter,
} from './utils';
import SearchConfigProvider from './provider';
import { useNumericFacetsProps } from './hooks';

function SearchWrapper({ uniqueFacets, uniqueFields, entityType }) {
  const initialFacets = mergeObjects([
    ...uniqueFacets,
    ...getDonorMetadataFields(entityType),
    createAffiliationFacet({ fieldName: 'group_name', label: 'Group', type: 'string' }),
    createAffiliationFacet({ fieldName: 'created_by_user_displayname', label: 'Creator', type: 'string' }),
  ]);

  const initialFields = mergeObjects([
    createField({ fieldName: 'hubmap_id', label: 'HuBMAP ID', type: 'string' }),
    createField({ fieldName: 'group_name', label: 'Group', type: 'string' }),
    ...uniqueFields,
    createField({ fieldName: 'mapped_last_modified_timestamp', label: 'Last Modified', type: 'string' }),
  ]);

  const defaultFilters = mergeObjects([getEntityTypeFilter(entityType), getDefaultFilters()]);

  const numericFacetsProps = useNumericFacetsProps(entityType);

  if (!Object.keys(numericFacetsProps).length) {
    return null;
  }

  return (
    <SearchConfigProvider
      initialConfig={{
        initialFacets,
        initialFields,
        facets: initialFacets,
        fields: initialFields,
        defaultFilters,
        entityType,
        numericFacetsProps,
        initialView: 'table',
      }}
    >
      <Search />
    </SearchConfigProvider>
  );
}

export default SearchWrapper;
