/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ProvTabs from './Detail/ProvTabs';
import Summary from './Detail/Summary';
import Attribution from './Detail/Attribution/Attribution';
import Protocol from './Detail/Protocol';
import MetadataTable from './Detail/MetadataTable';
import FileTable from './Detail/FileTable';
import Visualization from './Detail/Visualization';
import DetailLayout from './Detail/DetailLayout';

const StyledDivider = styled(Divider)`
  margin-left: 5px;
  margin-right: 5px;
  height: 15px;
  background-color: #444a65;
  align-self: center;
`;

function AssaySpecificItem(props) {
  const { children } = props;
  return (
    <>
      <Typography variant="body1">{children}</Typography>
      <StyledDivider orientation="vertical" flexItem />
    </>
  );
}

function SummaryData(props) {
  const { data_types, origin_sample } = props;
  return (
    <>
      {data_types && data_types.length > 0 && (
        <AssaySpecificItem>
          {data_types.constructor.name === 'Array' ? data_types.join(' / ') : data_types}
        </AssaySpecificItem>
      )}
      {origin_sample.organ && origin_sample.organ.length > 0 && (
        <Typography variant="body1">{origin_sample.organ}</Typography>
      )}
    </>
  );
}

function DatasetDetail(props) {
  const { assayMetadata, vitData, assetsEndpoint, flashed_messages, entityEndpoint } = props;
  const {
    protocol_url,
    portal_uploaded_protocol_files,
    metadata,
    files,
    uuid,
    data_types,
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
  } = assayMetadata;

  const shouldDisplaySection = {
    vizualization: 'name' in vitData,
    protocols: Boolean(portal_uploaded_protocol_files || protocol_url),
    metadataTable: metadata && 'metadata' in metadata,
    files: files && files.length > 0,
  };

  return (
    <DetailLayout shouldDisplaySection={shouldDisplaySection} flashed_messages={flashed_messages}>
      <Summary
        uuid={uuid}
        entity_type={entity_type}
        display_doi={display_doi}
        create_timestamp={create_timestamp}
        last_modified_timestamp={last_modified_timestamp}
        description={description}
        status={status}
      >
        <SummaryData data_types={data_types} origin_sample={origin_sample} />
      </Summary>
      {shouldDisplaySection.vizualization && <Visualization vitData={vitData} />}
      <Attribution
        group_name={group_name}
        created_by_user_displayname={created_by_user_displayname}
        created_by_user_email={created_by_user_email}
      />
      <ProvTabs uuid={uuid} assayMetadata={assayMetadata} entityEndpoint={entityEndpoint} />
      {shouldDisplaySection.protocols && (
        <Protocol protocol_url={protocol_url} portal_uploaded_protocol_files={portal_uploaded_protocol_files} />
      )}
      {shouldDisplaySection.metadataTable && <MetadataTable metadata={metadata.metadata} />}
      {shouldDisplaySection.files && <FileTable files={files} assetsEndpoint={assetsEndpoint} uuid={uuid} />}
    </DetailLayout>
  );
}

export default DatasetDetail;
