import React from 'react';
import PropTypes from 'prop-types';

import SearchDatasetTutorial from 'js/components/tutorials/SearchDatasetTutorial';
import { useAppContext } from 'js/components/Contexts';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { combineQueryClauses, getDefaultQuery } from 'js/helpers/functions';
import { decompressStringList } from 'js/helpers/compress';
import SearchWrapper from 'js/components/searchPage/SearchWrapper';
import { donorConfig, sampleConfig, datasetConfig, fieldsToHighlight } from 'js/components/searchPage/config';
import { listFilter } from 'js/components/searchPage/utils';
import SearchNote from 'js/components/searchPage/SearchNote';
import Results from 'js/components/searchPage/Results';
import { SearchHeader, StyledSvgIcon, SearchEntityHeader } from './style';

function Search({ title }) {
  const { elasticsearchEndpoint, groupsToken } = useAppContext();

  const hiddenFilters = [
    listFilter('ancestor_ids', 'Ancestor ID'),
    listFilter('entity_type', 'Entity Type'),
    listFilter('descendant_ids', 'Descendant ID'),
  ];

  const filtersByType = {
    donor: { ...donorConfig.filters, '': hiddenFilters },
    sample: { ...sampleConfig.filters, '': hiddenFilters },
    dataset: { ...datasetConfig.filters, '': hiddenFilters },
  };

  const resultFieldsByType = {
    donor: donorConfig.fields,
    sample: sampleConfig.fields,
    dataset: datasetConfig.fields,
  };

  const searchParams = new URLSearchParams(window.location.search);
  const typeParam = 'entity_type[0]';
  const capitalizedType = searchParams.get(typeParam) || '';
  const type = capitalizedType.toLowerCase();

  if (!(type in resultFieldsByType)) {
    throw Error(
      `Unexpected URL param "${typeParam}=${type}"; Should be one of {${Object.keys(resultFieldsByType).join(', ')}}`,
    );
  }

  const resultFields = resultFieldsByType[type];

  let defaultQuery = getDefaultQuery();
  const uuidParam = searchParams.get('uuid');
  const uuids = uuidParam ? decompressStringList(uuidParam) : [];
  if (uuids.length > 0) {
    defaultQuery = combineQueryClauses([
      defaultQuery,
      {
        ids: {
          values: uuids,
        },
      },
    ]);
  }

  const searchProps = {
    // Prefix for details links:
    detailsUrlPrefix: `/browse/${type || 'dataset'}/`,
    // Search results field which will be appended to detailsUrlPrefix:
    idField: 'uuid',
    // Search results fields to display in table:
    resultFields,
    // Default hitsPerPage is 10:
    hitsPerPage: 18,
    // Entity type
    type,
    // Sidebar facet configuration:
    filters: filtersByType[type],
    queryFields: ['all_text', ...fieldsToHighlight],
    isLoggedIn: Boolean(groupsToken),
    apiUrl: elasticsearchEndpoint,
    defaultQuery,
  };

  return (
    <>
      <SearchHeader component="h1" variant="h2">
        <SearchEntityHeader data-testid="search-header">
          <StyledSvgIcon component={entityIconMap[capitalizedType]} color="primary" />
          {title}
        </SearchEntityHeader>
      </SearchHeader>
      {type === 'dataset' && <SearchDatasetTutorial />}
      <SearchNote params={searchParams} />
      <SearchWrapper
        {...searchProps}
        resultsComponent={Results}
        analyticsCategory={`${title} Search Page Interactions`}
        elasticsearchEndpoint={elasticsearchEndpoint}
        groupsToken={groupsToken}
      />
    </>
  );
}

Search.propTypes = {
  title: PropTypes.string.isRequired,
  groupsToken: PropTypes.string,
};

Search.defaultProps = {
  groupsToken: '',
};

export default Search;
