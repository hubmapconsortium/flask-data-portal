import { useDerivedDatasetSearchHits, useDerivedSampleSearchHits } from 'js/hooks/useDerivedEntitySearchHits';
import { derivedDatasetsColumns, derivedSamplesColumns } from 'js/components/detailPage/derivedEntities/columns';

function useDerivedEntitiesSection(uuid) {
  const { searchHits: datasets, isLoading: derivedDatasetsAreLoading } = useDerivedDatasetSearchHits(uuid);
  const { searchHits: samples, isLoading: derivedSamplesAreLoading } = useDerivedSampleSearchHits(uuid);

  const isLoading = derivedDatasetsAreLoading || derivedSamplesAreLoading;

  const entities = [
    {
      entityType: 'Sample',
      tabLabel: 'Samples',
      data: samples,
      columns: derivedSamplesColumns,
    },
    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: datasets,
      columns: derivedDatasetsColumns,
    },
  ];

  return { entities, isLoading };
}

export { useDerivedEntitiesSection };
