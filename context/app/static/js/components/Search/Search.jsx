import React from 'react';
import Typography from '@material-ui/core/Typography';
import SearchWrapper from './SearchWrapper';
import { readCookie } from '../../helpers/functions';
import 'searchkit/theming/theme.scss';
import './Search.css';

import { donorConfig, sampleConfig, datasetConfig } from './config';
// eslint-disable-next-line import/named
import { filter } from './utils';

const baseFilters = [filter('ancestor_ids', 'Ancestor ID'), filter('entity_type', 'Entity Type')];

const filtersByType = {
  '': baseFilters,
  donor: donorConfig.filters.concat(baseFilters),
  sample: sampleConfig.filters.concat(baseFilters),
  dataset: datasetConfig.filters.concat(baseFilters),
};

const resultFieldsByType = {
  '': ['status', 'entity_type'],
  donor: donorConfig.fields,
  sample: sampleConfig.fields,
  dataset: datasetConfig.fields,
};
const type = (new URL(document.location).searchParams.get('entity_type[0]') || '').toLowerCase();

const searchProps = {
  // The default behavior is to add a "_search" path.
  // We don't want that.
  searchUrlPath: '',
  // Pass Globus token:
  httpHeaders: {
    Authorization: `Bearer ${readCookie('nexus_token')}`,
  },
  // Prefix for details links:
  detailsUrlPrefix: `/browse/${type || 'dataset'}/`,
  // Search results field which will be appended to detailsUrlPrefix:
  idField: 'uuid',
  // Search results fields to display in table:
  resultFields: resultFieldsByType[type],
  // Default hitsPerPage is 10:
  hitsPerPage: 20,
  // Sidebar facet configuration;
  // "type" should be one of the filters described here:
  // http://docs.searchkit.co/stable/components/navigation/
  filters: filtersByType[type],
  sortOptions: [
    {
      label: 'Newest',
      field: 'last_modified_timestamp',
      order: 'desc',
      defaultOption: true,
    },
    {
      label: 'Oldest',
      field: 'last_modified_timestamp',
      order: 'asc',
      defaultOption: false,
    },
  ],
  hiddenFilterIds: ['entity_type', 'ancestor_ids'],
  hiddenValueFilterIds: ['ancestor_ids'],
  queryFields: resultFieldsByType[type].map((field) => field.id),
};

function Search(props) {
  const { title, elasticsearchEndpoint } = props;
  const allProps = Object.assign(searchProps, { apiUrl: elasticsearchEndpoint });
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <>
      <Typography component="h1" variant="h1">
        {title}
      </Typography>
      <SearchWrapper {...allProps} />
    </>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default Search;
