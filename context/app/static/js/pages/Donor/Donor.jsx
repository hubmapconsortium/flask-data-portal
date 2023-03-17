import React, { useEffect } from 'react';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import useSendUUIDEvent from 'js/components/detailPage/useSendUUIDEvent';
import useEntityStore from 'js/stores/useEntityStore';
import { useDerivedDatasetSearchHits, useDerivedSampleSearchHits } from 'js/hooks/useDerivedEntitySearchHits';

import DetailContext from 'js/components/detailPage/context';
import { getSectionOrder } from 'js/components/detailPage/utils';
import DerivedEntitiesSection from 'js/components/detailPage/derivedEntities/DerivedEntitiesSection';

const entityStoreSelector = (state) => state.setAssayMetadata;

function DonorDetail({ assayMetadata }) {
  const {
    uuid,
    protocol_url,
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    hubmap_id,
    entity_type,
    created_timestamp,
    last_modified_timestamp,
    description,
    mapped_metadata = {},
    // As data comes in from other consortia, we won't be able
    // to rely on donor metadata always being available.
    // Unpublished HuBMAP data may also be missing donor metadata.
  } = assayMetadata;

  const { sex, race, age_value, age_unit } = mapped_metadata;

  const { searchHits: derivedDatasets, isLoading: derivedDatasetsAreLoading } = useDerivedDatasetSearchHits(uuid);
  const { searchHits: derivedSamples, isLoading: derivedSamplesAreLoading } = useDerivedSampleSearchHits(uuid);

  const derivedEntitiesAreLoading = derivedDatasetsAreLoading || derivedSamplesAreLoading;

  const shouldDisplaySection = {
    protocols: Boolean(protocol_url),
    metadata: Boolean(Object.keys(mapped_metadata).length),
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'metadata', 'derived', 'provenance', 'protocols', 'attribution'],
    shouldDisplaySection,
  );

  const setAssayMetadata = useEntityStore(entityStoreSelector);

  useEffect(() => {
    setAssayMetadata({ hubmap_id, entity_type, sex, race, age_value, age_unit });
  }, [setAssayMetadata, hubmap_id, entity_type, sex, race, age_value, age_unit]);

  useSendUUIDEvent(entity_type, uuid);

  return (
    <DetailContext.Provider value={{ hubmap_id, uuid }}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          title={hubmap_id}
          created_timestamp={created_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
          group_name={group_name}
        />
        {shouldDisplaySection.metadata && <MetadataTable metadata={mapped_metadata} hubmap_id={hubmap_id} />}
        <DerivedEntitiesSection
          entities={derivedDatasets}
          samples={derivedSamples}
          datasets={derivedDatasets}
          uuid={uuid}
          isLoading={derivedEntitiesAreLoading}
          entityType={entity_type}
          sectionId="derived"
        />
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DonorDetail;
