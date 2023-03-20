import { useMemo } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';

function getTypeQuery(ancestorUUID, type) {
  return {
    bool: {
      filter: [
        {
          term: {
            ancestor_ids: ancestorUUID,
          },
        },
        {
          term: {
            entity_type: type,
          },
        },
      ],
    },
  };
}

function useDerivedDatasetSearchHits(ancestorUUID) {
  const query = useMemo(
    () => ({
      query: getTypeQuery(ancestorUUID, 'dataset'),
      _source: [
        'uuid',
        'hubmap_id',
        'entity_type',
        'mapped_data_types',
        'status',
        'descendant_counts',
        'last_modified_timestamp',
      ],
      size: 10000,
    }),
    [ancestorUUID],
  );

  return useSearchHits(query);
}

function useDerivedSampleSearchHits(ancestorUUID) {
  const query = useMemo(
    () => ({
      query: getTypeQuery(ancestorUUID, 'sample'),
      _source: [
        'uuid',
        'hubmap_id',
        'entity_type',
        'origin_samples_unique_mapped_organs',
        'sample_category',
        'descendant_counts',
        'last_modified_timestamp',
      ],
      size: 10000,
    }),
    [ancestorUUID],
  );
  return useSearchHits(query);
}

export { useDerivedDatasetSearchHits, useDerivedSampleSearchHits };
