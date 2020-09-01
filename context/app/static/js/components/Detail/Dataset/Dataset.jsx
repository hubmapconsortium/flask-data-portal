import React from 'react';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import Files from 'js/components/files/Files';
import ProvSection from '../ProvSection';
import Summary from '../Summary';
import Attribution from '../Attribution';
import Protocol from '../Protocol';
import MetadataTable from '../MetadataTable';
import VisualizationWrapper from '../VisualizationWrapper';
import DetailLayout from '../DetailLayout';
import SummaryItem from '../SummaryItem';
import useSendUUIDEvent from '../useSendUUIDEvent';

// TODO use this context for components other than FileBrowser
import DetailContext from '../context';

function SummaryDataChildren(props) {
  const { mapped_data_types, origin_sample } = props;
  return (
    <>
      <SummaryItem>
        <LightBlueLink variant="h6" href="/docs/assays" underline="none">
          {mapped_data_types[0]}
        </LightBlueLink>
      </SummaryItem>
      <Typography variant="h6" component="p">
        {origin_sample.mapped_organ}
      </Typography>
    </>
  );
}

function DatasetDetail(props) {
  const { assayMetadata, vitData, assetsEndpoint, elasticsearchEndpoint, entityEndpoint } = props;
  const {
    protocol_url,
    metadata,
    files,
    uuid,
    data_types,
    mapped_data_types,
    origin_sample,
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    description,
    status,
    mapped_data_access_level,
  } = assayMetadata;

  const shouldDisplaySection = {
    visualization: 'name' in vitData || (vitData[0] && 'name' in vitData[0]),
    protocols: Boolean(protocol_url),
    metadataTable: metadata && 'metadata' in metadata,
    files: true,
  };

  useSendUUIDEvent(entity_type, uuid);

  // TODO: When all environments are clean, data_types array fallbacks shouldn't be needed.
  return (
    <DetailContext.Provider
      value={{ assetsEndpoint, elasticsearchEndpoint, display_doi, uuid, mapped_data_access_level }}
    >
      <DetailLayout shouldDisplaySection={shouldDisplaySection}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          display_doi={display_doi}
          create_timestamp={create_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
          status={status}
          mapped_data_access_level={mapped_data_access_level}
        >
          <SummaryDataChildren
            data_types={data_types || []}
            mapped_data_types={mapped_data_types || []}
            origin_sample={origin_sample}
          />
        </Summary>
        {shouldDisplaySection.visualization && <VisualizationWrapper vitData={vitData} />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} entityEndpoint={entityEndpoint} />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadataTable && <MetadataTable metadata={metadata.metadata} display_doi={display_doi} />}
        <Files files={files} entityEndpoint={entityEndpoint} uuid={uuid} display_doi={display_doi} />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DatasetDetail;
