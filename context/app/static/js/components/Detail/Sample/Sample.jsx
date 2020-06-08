/* eslint-disable camelcase */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import ProvTabs from '../ProvTabs';
import Summary from '../Summary';
import Attribution from '../Attribution';
import Protocol from '../Protocol';
import Metadata from '../Metadata';
import SummaryItem from '../SummaryItem';
import DetailLayout from '../DetailLayout';

function SummaryData(props) {
  const { organ, origin_sample, specimen_type } = props;
  return (
    <>
      {organ && organ.length > 0 && <SummaryItem>{organ}</SummaryItem>}
      {origin_sample.organ && origin_sample.organ.length > 0 && !organ && (
        <SummaryItem>{origin_sample.organ}</SummaryItem>
      )}
      {specimen_type && specimen_type.length > 0 && <Typography variant="body1">{specimen_type}</Typography>}
    </>
  );
}

function SampleDetail(props) {
  const { assayMetadata, flashed_messages, entityEndpoint } = props;
  const {
    uuid,
    protocol_url,
    portal_uploaded_protocol_files,
    organ,
    specimen_type,
    origin_sample,
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    description,
  } = assayMetadata;

  const shouldDisplaySection = {
    protocols: Boolean(portal_uploaded_protocol_files || protocol_url),
    metadata: true,
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
      >
        <SummaryData organ={organ} specimen_type={specimen_type} origin_sample={origin_sample} />
      </Summary>
      <Metadata entity_type={entity_type} organ={organ} specimenType={specimen_type} origin_sample={origin_sample} />
      <Attribution
        group_name={group_name}
        created_by_user_displayname={created_by_user_displayname}
        created_by_user_email={created_by_user_email}
      />
      <ProvTabs uuid={uuid} assayMetadata={assayMetadata} entityEndpoint={entityEndpoint} />
      {shouldDisplaySection.protocols && (
        <Protocol protocol_url={protocol_url} portal_uploaded_protocol_files={portal_uploaded_protocol_files} />
      )}
    </DetailLayout>
  );
}

export default SampleDetail;
