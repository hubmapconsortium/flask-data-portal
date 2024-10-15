import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import CollectionsSection from 'js/components/detailPage/CollectionsSection';
import { DetailPageAlert } from 'js/components/detailPage/style';
import BulkDataTransfer from 'js/components/detailPage/BulkDataTransfer';
import { DetailContextProvider } from 'js/components/detailPage/DetailContext';
import { getCombinedDatasetStatus } from 'js/components/detailPage/utils';
import ComponentAlert from 'js/components/detailPage/multi-assay/ComponentAlert';
import MultiAssayRelationship from 'js/components/detailPage/multi-assay/MultiAssayRelationship';
import MetadataSection from 'js/components/detailPage/MetadataSection';
import { Dataset, Donor, Entity, Sample, isDataset } from 'js/components/types';
import DatasetRelationships from 'js/components/detailPage/DatasetRelationships';
import ProcessedDataSection from 'js/components/detailPage/ProcessedData';
import { SelectedVersionStoreProvider } from 'js/components/detailPage/VersionSelect/SelectedVersionStore';
import SupportAlert from 'js/components/detailPage/SupportAlert';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useDatasetRelationships } from 'js/components/detailPage/DatasetRelationships/hooks';
import { useDatasetsCollections } from 'js/hooks/useDatasetsCollections';
import useTrackID from 'js/hooks/useTrackID';
import { InternalLink } from 'js/shared-styles/Links';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import { useEntitiesData } from 'js/hooks/useEntityData';
import { hasMetadata } from 'js/helpers/metadata';
import { useProcessedDatasets, useProcessedDatasetsSections, useRedirectAlert } from './hooks';

interface SummaryDataChildrenProps {
  mapped_data_types: string[];
  mapped_organ: string;
}

function SummaryDataChildren({ mapped_data_types, mapped_organ }: SummaryDataChildrenProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const dataTypes = mapped_data_types.join(', ');
  return (
    <>
      <SummaryItem>
        <InternalLink
          href="https://docs.hubmapconsortium.org/assays"
          underline="none"
          onClick={() => trackEntityPageEvent({ action: 'Assay Documentation Navigation', label: dataTypes })}
        >
          {dataTypes}
        </InternalLink>
      </SummaryItem>
      <SummaryItem showDivider={false}>
        <InternalLink href={`/organ/${mapped_organ}`} underline="none">
          <Stack direction="row" spacing={0.25} alignItems="center">
            <OrganIcon organName={mapped_organ} />
            {mapped_organ}
          </Stack>
        </InternalLink>
      </SummaryItem>
    </>
  );
}

function ExternalDatasetAlert({ isExternal }: { isExternal: boolean }) {
  if (!isExternal) {
    return null;
  }

  return (
    <DetailPageAlert severity="info">
      You are viewing an external dataset that was not generated by the HuBMAP Consortium.
    </DetailPageAlert>
  );
}

interface EntityDetailProps<T extends Entity> {
  assayMetadata: T;
}

function DatasetDetail({ assayMetadata }: EntityDetailProps<Dataset>) {
  const {
    protocol_url,
    uuid,
    mapped_data_types,
    origin_samples,
    hubmap_id,
    status,
    sub_status,
    mapped_data_access_level,
    mapped_external_group_name,
    contributors,
    contacts,
    is_component,
    assay_modality,
    processing,
    ancestor_ids,
  } = assayMetadata;

  const [entities, loadingEntities] = useEntitiesData<Dataset | Donor | Sample>([uuid, ...ancestor_ids]);
  const entitiesWithMetadata = entities.filter((e) =>
    hasMetadata({ targetEntityType: e.entity_type, currentEntity: e }),
  );

  useRedirectAlert();

  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const { sections, isLoading } = useProcessedDatasetsSections();
  const { searchHits: processedDatasets } = useProcessedDatasets();

  // Top level request for collections data to determine if there are any collections for any of the datasets
  const collectionsData = useDatasetsCollections([uuid, ...processedDatasets.map((ds) => ds._id)]);

  const shouldDisplaySection = {
    summary: true,
    metadata: true,
    'processed-data': sections,
    'bulk-data-transfer': true,
    provenance: true,
    protocols: Boolean(protocol_url),
    collections: Boolean(collectionsData.length),
    attribution: true,
  };

  const { shouldDisplay: shouldDisplayRelationships } = useDatasetRelationships(uuid, processing);

  if (loadingEntities) {
    return null;
  }

  return (
    <DetailContextProvider hubmap_id={hubmap_id} uuid={uuid} mapped_data_access_level={mapped_data_access_level}>
      <SelectedVersionStoreProvider initialVersionUUIDs={processedDatasets?.map((ds) => ds._id) ?? []}>
        <ExternalDatasetAlert isExternal={Boolean(mapped_external_group_name)} />
        {Boolean(is_component) && <ComponentAlert />}
        <DetailLayout sections={shouldDisplaySection} isLoading={isLoading}>
          <Summary
            entityTypeDisplay="Dataset"
            status={combinedStatus}
            mapped_data_access_level={mapped_data_access_level}
            mapped_external_group_name={mapped_external_group_name}
            bottomFold={
              <>
                <MultiAssayRelationship assay_modality={assay_modality} />
                {shouldDisplayRelationships && (
                  <Box height={400} width="100%" component={Paper} p={2}>
                    <DatasetRelationships uuid={uuid} processing={processing} />
                  </Box>
                )}
              </>
            }
          >
            <SummaryDataChildren mapped_data_types={mapped_data_types} mapped_organ={mapped_organ} />
          </Summary>
          <MetadataSection entities={entitiesWithMetadata} shouldDisplay={shouldDisplaySection.metadata} />
          <ProcessedDataSection shouldDisplay={Boolean(shouldDisplaySection['processed-data'])} />
          <BulkDataTransfer shouldDisplay={Boolean(shouldDisplaySection['bulk-data-transfer'])} />
          <ProvSection shouldDisplay={shouldDisplaySection.provenance} />
          <CollectionsSection shouldDisplay={shouldDisplaySection.collections} />
          <Attribution>
            <ContributorsTable contributors={contributors} contacts={contacts} />
          </Attribution>
        </DetailLayout>
      </SelectedVersionStoreProvider>
    </DetailContextProvider>
  );
}

// Shared logic for the Dataset and Support cases
function DetailPageWrapper({ assayMetadata, ...props }: EntityDetailProps<Entity>) {
  const { entity_type, hubmap_id } = assayMetadata;
  useTrackID({ entity_type, hubmap_id });

  if (isDataset(assayMetadata)) {
    return <DatasetDetail assayMetadata={assayMetadata} {...props} />;
  }
  // Should never be reached due to server-side redirect to primary dataset, but just in case...
  return <SupportAlert uuid={assayMetadata.uuid} isSupport />;
}

export default DetailPageWrapper;
