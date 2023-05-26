import React, { useEffect } from 'react';

import ContributorsTable from 'js/components/detailPage/ContributorsTable/ContributorsTable';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import { getCombinedDatasetStatus, getSectionOrder } from 'js/components/detailPage/utils';
import PublicationSummary from 'js/components/publications/PublicationSummary';
import PublicationsVisualizationSection from 'js/components/publications/PublicationVisualizationsSection/';
import PublicationsDataSection from 'js/components/publications/PublicationsDataSection';
import useEntityStore from 'js/stores/useEntityStore';

const entityStoreSelector = (state) => state.setAssayMetadata;

function Publication({ publication, vignette_json }) {
  const {
    title,
    uuid,
    entity_type,
    hubmap_id,
    status,
    sub_status,
    doi_url,
    contributors,
    ancestor_ids,
    publication_venue,
  } = publication;

  const setAssayMetadata = useEntityStore(entityStoreSelector);
  useEffect(() => {
    setAssayMetadata({ hubmap_id, entity_type, title, publication_venue });
  }, [hubmap_id, entity_type, title, publication_venue, setAssayMetadata]);

  const shouldDisplaySection = {
    visualizations: Boolean(Object.keys(vignette_json).length),
  };

  const sectionOrder = getSectionOrder(
    ['summary', 'data', 'visualizations', 'authors', 'provenance'],
    shouldDisplaySection,
  );

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const hasDOI = doi_url !== undefined;

  return (
    <DetailLayout sectionOrder={sectionOrder}>
      <PublicationSummary {...publication} status={combinedStatus} hasDOI={hasDOI} />
      <PublicationsDataSection uuid={uuid} datasetUUIDs={ancestor_ids} />
      {shouldDisplaySection.visualizations && (
        <PublicationsVisualizationSection vignette_json={vignette_json} uuid={uuid} />
      )}
      <ContributorsTable contributors={contributors} title="Authors" />
      <ProvSection uuid={uuid} assayMetadata={publication} />
    </DetailLayout>
  );
}

export default Publication;
