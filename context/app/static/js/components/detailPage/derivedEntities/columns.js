import format from 'date-fns/format';

const descendantCountsCol = {
  id: 'descendant_counts.entity_type.Dataset',
  label: 'Derived Dataset Count',
  renderColumnCell: ({ descendant_counts }) => descendant_counts?.entity_type?.Dataset || 0,
};

const lastModifiedTimestampCol = {
  id: 'last_modified_timestamp',
  label: 'Last Modified',
  renderColumnCell: ({ last_modified_timestamp }) => format(last_modified_timestamp, 'yyyy-MM-dd'),
};

const derivedSamplesColumns = [
  {
    id: 'origin_samples_unique_mapped_organs',
    label: 'Organ',
    renderColumnCell: ({ origin_samples_unique_mapped_organs }) => origin_samples_unique_mapped_organs.join(', '),
  },
  { id: 'sample_category', label: 'Sample Category', renderColumnCell: ({ sample_category }) => sample_category },
  descendantCountsCol,
  lastModifiedTimestampCol,
];

const derivedDatasetsColumns = [
  {
    id: 'mapped_data_types',
    label: 'Data Types',
    renderColumnCell: ({ mapped_data_types }) => mapped_data_types.join(', '),
  },
  { id: 'status', label: 'Status', renderColumnCell: ({ status }) => status },
  descendantCountsCol,
  lastModifiedTimestampCol,
];

export { derivedSamplesColumns, derivedDatasetsColumns, lastModifiedTimestampCol };
