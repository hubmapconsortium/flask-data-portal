import { useFlaskDataContext } from 'js/components/Contexts';
import { isDataset, type Dataset } from 'js/components/types';
import { excludeComponentDatasetsClause, getIDsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useProcessedDatasets, type ProcessedDatasetInfo } from 'js/pages/Dataset/hooks';

export type ProcessedDatasetDetails = ProcessedDatasetInfo &
  Pick<
    Dataset,
    | 'description'
    | 'status'
    | 'group_name'
    | 'created_by_user_displayname'
    | 'created_by_user_email'
    | 'title'
    | 'published_timestamp'
    | 'created_timestamp'
    | 'metadata'
    | 'protocol_url' // TODO: This is present for non-dataset entities, but not for datasets.
    | 'dataset_type'
    | 'creation_action'
  >;

export function useProcessedDatasetDetails(uuid: string) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(uuid), excludeComponentDatasetsClause],
      },
    },
    _source: [
      'hubmap_id',
      'entity_type',
      'uuid',
      'assay_display_name',
      'files',
      'pipeline',
      'description',
      'status',
      'group_name',
      'created_by_user_displayname',
      'created_by_user_email',
      'title',
      'published_timestamp',
      'created_timestamp',
      'metadata.dag_provenance_list',
      'metadata.metadata',
      'protocol_url',
      'dataset_type',
      'creation_action',
    ],
    size: 10000,
  };

  const { searchHits, isLoading } = useSearchHits<ProcessedDatasetDetails>(query, {
    useDefaultQuery: false,
  });

  const datasetDetails = searchHits[0]?._source;
  return { datasetDetails, isLoading };
}

export function useProcessedDatasetTabs(): { label: string; uuid: string }[] {
  const { searchHits } = useProcessedDatasets();
  const { entity } = useFlaskDataContext();

  if (!isDataset(entity)) {
    return [];
  }

  const { dataset_type, uuid } = entity;

  const primaryDatasetTab = {
    label: dataset_type,
    uuid,
  };

  // include the processed dataset's status in the label if more than one processed dataset of this type exists.
  const processedDatasetTabs = searchHits.map(({ _source }, idx, hits) => ({
    label: hits.find((h) => h._source.pipeline === _source.pipeline)
      ? `${_source.pipeline} (${_source.status})`
      : _source.pipeline,
    uuid: _source.uuid,
  }));

  return [primaryDatasetTab, ...processedDatasetTabs];
}
