import React, { useEffect, useContext } from 'react';

import { FlaskDataContext } from 'js/components/App';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import useSendUUIDEvent from 'js/components/detailPage/useSendUUIDEvent';
import useEntityStore from 'js/stores/useEntityStore';

import DetailContext from 'js/components/detailPage/context';
import { getSectionOrder } from 'js/components/detailPage/utils';
import DerivedEntitiesSection from 'js/components/detailPage/derivedEntities/DerivedEntitiesSection';

const entityStoreSelector = (state) => state.setAssayMetadata;

function DonorDetail() {
  const { entity: assayMetadata } = useContext(FlaskDataContext);

  const {
    uuid,
    protocol_url,
    hubmap_id,
    entity_type,
    mapped_metadata = {},
    // As data comes in from other consortia, we won't be able
    // to rely on donor metadata always being available.
    // Unpublished HuBMAP data may also be missing donor metadata.
  } = assayMetadata;

  const { sex, race, age_value, age_unit } = mapped_metadata;

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
  }, [hubmap_id, entity_type, sex, race, age_value, age_unit, setAssayMetadata]);

  useSendUUIDEvent(entity_type, uuid);

  return (
    <DetailContext.Provider value={{ hubmap_id, uuid }}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary />
        {shouldDisplaySection.metadata && <MetadataTable />}
        <DerivedEntitiesSection sectionId="derived" />
        <ProvSection />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        <Attribution />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DonorDetail;
