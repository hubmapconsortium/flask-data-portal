import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { InternalLink } from 'js/shared-styles/Links';
import Files from 'js/components/detailPage/files/Files';
import DataProducts from 'js/components/detailPage/files/DataProducts';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import CollectionsSection from 'js/components/detailPage/CollectionsSection';
import SupportAlert from 'js/components/detailPage/SupportAlert';
import { DetailPageAlert } from 'js/components/detailPage/style';
import BulkDataTransfer from 'js/components/detailPage/BulkDataTransfer';
import { DetailContextProvider } from 'js/components/detailPage/DetailContext';
import { getCombinedDatasetStatus } from 'js/components/detailPage/utils';

import { combineMetadata } from 'js/pages/utils/entity-utils';
import { useDatasetsCollections } from 'js/hooks/useDatasetsCollections';
import useTrackID from 'js/hooks/useTrackID';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

import ComponentAlert from 'js/components/detailPage/multi-assay/ComponentAlert';
import MultiAssayRelationship from 'js/components/detailPage/multi-assay/MultiAssayRelationship';
import MetadataSection from 'js/components/detailPage/MetadataSection';
import { Dataset, Entity, isDataset, isSupport, Sample, Support } from 'js/components/types';
import DatasetRelationships from 'js/components/detailPage/DatasetRelationships';
import ProcessedDataSection from 'js/components/detailPage/ProcessedData';
import { SelectedVersionStoreProvider } from 'js/components/detailPage/VersionSelect/SelectedVersionStore';
import useDatasetLabel, { useProcessedDatasets, useProcessedDatasetsSections } from './hooks';

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
          variant="h6"
          href="https://docs.hubmapconsortium.org/assays"
          underline="none"
          onClick={() => trackEntityPageEvent({ action: 'Assay Documentation Navigation', label: dataTypes })}
        >
          {dataTypes}
        </InternalLink>
      </SummaryItem>
      <SummaryItem showDivider={false}>
        <InternalLink variant="h6" href={`/organ/${mapped_organ}`} underline="none">
          {mapped_organ}
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

function makeMetadataSectionProps(metadata: Record<string, string>, assay_modality: 'single' | 'multiple') {
  return assay_modality === 'multiple' ? { assay_modality } : { metadata, assay_modality };
}

function SupportDetail({ assayMetadata }: EntityDetailProps<Support>) {
  const {
    metadata,
    files,
    donor,
    source_samples,
    uuid,
    mapped_data_types,
    origin_samples,
    hubmap_id,
    entity_type,
    status,
    mapped_data_access_level,
    mapped_external_group_name,
    contributors,
    contacts,
    is_component,
    assay_modality,
  } = assayMetadata;

  const combinedMetadata = combineMetadata(donor, source_samples as Sample[], metadata as Record<string, unknown>);

  const shouldDisplaySection = {
    summary: true,
    provenance: false,
    metadata: Boolean(Object.keys(combinedMetadata).length) || assay_modality === 'multiple',
    files: Boolean(files?.length),
    'bulk-data-transfer': true,
    attribution: true,
  };

  const datasetLabel = useDatasetLabel();

  return (
    <DetailContextProvider hubmap_id={hubmap_id} uuid={uuid} mapped_data_access_level={mapped_data_access_level}>
      <ExternalDatasetAlert isExternal={Boolean(mapped_external_group_name)} />
      <SupportAlert uuid={uuid} isSupport={entity_type === 'Support'} />
      {Boolean(is_component) && <ComponentAlert />}
      <DetailLayout sections={shouldDisplaySection}>
        <Summary
          entityTypeDisplay={datasetLabel}
          status={status}
          mapped_data_access_level={mapped_data_access_level}
          bottomFold={
            <>
              <MultiAssayRelationship assay_modality={assay_modality} />
              <DataProducts files={files} />
            </>
          }
        >
          <SummaryDataChildren mapped_organ={origin_samples[0].mapped_organ} mapped_data_types={mapped_data_types} />
        </Summary>
        {shouldDisplaySection.metadata && (
          <MetadataSection {...makeMetadataSectionProps(combinedMetadata, assay_modality)} />
        )}
        {shouldDisplaySection.files && <Files files={files} />}
        {shouldDisplaySection['bulk-data-transfer'] && <BulkDataTransfer />}

        <Attribution>
          <ContributorsTable contributors={contributors} contacts={contacts} title="Contributors" showInfoAlert />
        </Attribution>
      </DetailLayout>
    </DetailContextProvider>
  );
}

function DatasetDetail({ assayMetadata }: EntityDetailProps<Dataset>) {
  const {
    protocol_url,
    files,
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
  } = assayMetadata;

  const origin_sample = origin_samples[0];
  const { mapped_organ } = origin_sample;

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const { sections, isLoading } = useProcessedDatasetsSections();
  const { searchHits: processedDatasets } = useProcessedDatasets();

  // Top level request for collections data to determine if there are any collections for any of the datasets
  const collectionsData = useDatasetsCollections([uuid, ...processedDatasets.map((ds) => ds._id)]);

  const shouldDisplaySection = {
    summary: true,
    'processed-data': sections,
    provenance: true,
    protocols: Boolean(protocol_url),
    metadata: true,
    files: Boolean(files?.length),
    'bulk-data-transfer': true,
    collections: Boolean(collectionsData.length),
    attribution: true,
  };

  const datasetLabel = useDatasetLabel();

  return (
    <DetailContextProvider hubmap_id={hubmap_id} uuid={uuid} mapped_data_access_level={mapped_data_access_level}>
      <SelectedVersionStoreProvider initialVersionUUIDs={processedDatasets?.map((ds) => ds._id) ?? []}>
        <ExternalDatasetAlert isExternal={Boolean(mapped_external_group_name)} />
        {Boolean(is_component) && <ComponentAlert />}
        <DetailLayout sections={shouldDisplaySection} isLoading={isLoading}>
          <Summary
            entityTypeDisplay={datasetLabel}
            status={combinedStatus}
            mapped_data_access_level={mapped_data_access_level}
            mapped_external_group_name={mapped_external_group_name}
            bottomFold={
              <>
                <MultiAssayRelationship assay_modality={assay_modality} />
                <DataProducts files={files} />
                <Box height={400} width="100%" component={Paper} p={2}>
                  <DatasetRelationships uuid={uuid} processing={processing} />
                </Box>
              </>
            }
          >
            <SummaryDataChildren mapped_data_types={mapped_data_types} mapped_organ={mapped_organ} />
          </Summary>
          {shouldDisplaySection.metadata && <MetadataSection />}
          {shouldDisplaySection['processed-data'] && <ProcessedDataSection />}
          {shouldDisplaySection['bulk-data-transfer'] && <BulkDataTransfer />}
          {shouldDisplaySection.provenance && <ProvSection />}
          {shouldDisplaySection.collections && <CollectionsSection />}
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
    return (
      <SelectedVersionStoreProvider initialVersionUUIDs={assayMetadata.descendant_ids}>
        <DatasetDetail assayMetadata={assayMetadata} {...props} />;
      </SelectedVersionStoreProvider>
    );
  }
  if (isSupport(assayMetadata)) {
    return <SupportDetail assayMetadata={assayMetadata} {...props} />;
  }
  console.error('Unsupported entity type');
  return null;
}

export default DetailPageWrapper;
