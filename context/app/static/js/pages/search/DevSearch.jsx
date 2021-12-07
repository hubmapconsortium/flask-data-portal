import React, { useContext } from 'react';
import { ExistsQuery, BoolMustNot } from 'searchkit';

import { getAuthHeader } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';
import { field, listFilter, checkboxFilter, hierarchicalFilter } from 'js/components/Search/utils';
import { fieldsToHighlight } from 'js/components/Search/config';
import SearchWrapper from 'js/components/Search/SearchWrapper';
import DevResults from 'js/components/Search/DevResults';
import { SearchHeader } from './style';

function DevSearch() {
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const httpHeaders = getAuthHeader(groupsToken);

  const searchProps = {
    // The default behavior is to add a "_search" path.
    // We don't want that.
    searchUrlPath: '',
    // Pass Globus token:
    httpHeaders,
    // Prefix for details links: (Entities which are not datasets will redirect.)
    detailsUrlPrefix: '/browse/dataset/',
    // Search results field which will be appended to detailsUrlPrefix:
    idField: 'uuid',
    // Search results fields to display in table:
    resultFields: {
      table: [
        field('entity_type', 'type'),
        field('hubmap_id', 'ID'),
        field('mapped_last_modified_timestamp', 'Last Modified'),
        field('mapper_metadata.size', 'Doc Size'),
      ],
      tile: [],
      ccf: [field('rui_location', 'Location JSON')],
    },
    // Default hitsPerPage is 10:
    hitsPerPage: 20,
    // Sidebar facet configuration:
    filters: {
      Core: [
        listFilter('entity_type', 'Entity Type'),
        listFilter('mapper_metadata.version', 'Mapper Version'),
        listFilter('index_version', 'Index Version'),
        hierarchicalFilter(
          [...Array(5).keys()].map((i) => `anatomy_${i + 1}`),
          'Anatomy',
        ),
      ],
      'Assay Types': [
        listFilter('data_types', 'data_types'),
        listFilter('mapped_data_types', 'mapped_data_types'),
        listFilter('metadata.metadata.assay_category', 'assay_category'),
        listFilter('metadata.metadata.assay_type', 'assay_type'),
      ],
      'Validation Errors': [
        listFilter('mapper_metadata.validation_errors.absolute_path', 'Document Path'),
        listFilter('mapper_metadata.validation_errors.absolute_schema_path', 'Schema Path'),
      ],
      Booleans: [
        checkboxFilter('has_substatus', 'Has substatus?', ExistsQuery('sub_status')),
        checkboxFilter('is_living_donor', 'Is living donor?', ExistsQuery('metadata.living_donor_data')),
        checkboxFilter('is_organ_donor', 'Is organ donor?', ExistsQuery('metadata.organ_donor_data')),
        checkboxFilter('has_metadata', 'Has metadata?', ExistsQuery('metadata.metadata')),
        checkboxFilter('no_metadata', 'No metadata?', BoolMustNot(ExistsQuery('metadata.metadata'))),
        checkboxFilter('has_files', 'Has files?', ExistsQuery('files')),
        checkboxFilter('no_files', 'No files?', BoolMustNot(ExistsQuery('files'))),
        checkboxFilter('has_rui_sample', 'Spatial Sample?', ExistsQuery('rui_location')),
        checkboxFilter('no_rui_sample', 'Not Spatial Sample?', BoolMustNot(ExistsQuery('rui_location'))),
        checkboxFilter('has_rui_dataset', 'Spatial Dataset?', ExistsQuery('ancestors.rui_location')),
        checkboxFilter('no_rui_dataset', 'Not Spatial Dataset?', BoolMustNot(ExistsQuery('ancestors.rui_location'))),
        checkboxFilter('has_errors', 'Validation Errors?', ExistsQuery('mapper_metadata.validation_errors')),
        checkboxFilter(
          'no_errors',
          'No Validation Errors?',
          BoolMustNot(ExistsQuery('mapper_metadata.validation_errors')),
        ),
        checkboxFilter('has_next', 'Has next?', ExistsQuery('next_revision_uuid')),
        checkboxFilter('has_previous', 'Has previous?', ExistsQuery('previous_revision_uuid')),
      ],
    },
    queryFields: ['all_text', ...fieldsToHighlight],
    isLoggedIn: Boolean(groupsToken),
  };

  const allProps = { ...searchProps, apiUrl: elasticsearchEndpoint };

  const wrappedSearch = (
    <SearchWrapper
      {...allProps}
      resultsComponent={DevResults}
      analyticsCategory="Dev Search Page Interactions"
      isDevSearch
      elasticsearchEndpoint={elasticsearchEndpoint}
      groupsToken={groupsToken}
    />
  );
  return (
    <>
      <SearchHeader component="h1" variant="h2">
        Dev Search
      </SearchHeader>
      {wrappedSearch}
    </>
  );
}

export default DevSearch;
