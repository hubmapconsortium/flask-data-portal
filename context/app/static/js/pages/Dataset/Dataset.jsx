import React, { useEffect, useContext, useCallback } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

import { AppContext } from 'js/components/Providers';
import { LightBlueLink } from 'js/shared-styles/Links';
import Files from 'js/components/detailPage/files/Files';
import ProvSection from 'js/components/detailPage/provenance/ProvSection';
import Summary from 'js/components/detailPage/summary/Summary';
import Attribution from 'js/components/detailPage/Attribution';
import Protocol from 'js/components/detailPage/Protocol';
import MetadataTable from 'js/components/detailPage/MetadataTable';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import useSendUUIDEvent from 'js/components/detailPage/useSendUUIDEvent';
import useEntityStore from 'js/stores/useEntityStore';
import CollectionsSection from 'js/components/detailPage/CollectionsSection';
import SupportAlert from 'js/components/detailPage/SupportAlert';
import { DetailPageAlert } from 'js/components/detailPage/style';

import { ReactComponent as WorkspacesIcon } from 'assets/svg/workspaces.svg';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
// TODO use this context for components other than FileBrowser
import DetailContext from 'js/components/detailPage/context';
import { getSectionOrder, getCombinedDatasetStatus } from 'js/components/detailPage/utils';
import CreateWorkspaceDialog from 'js/components/workspaces/CreateWorkspaceDialog';

import { combineMetadata } from 'js/pages/utils/entity-utils';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useDatasetCollections } from './hooks';

function NotebookButton(props) {
  return (
    <SecondaryBackgroundTooltip title="Launch a new workspace in Jupyter notebook.">
      <WhiteBackgroundIconButton color="primary" {...props}>
        <SvgIcon component={WorkspacesIcon} />
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
  );
}

function SummaryDataChildren({
  mapped_data_types,
  origin_sample,
  doi_url,
  registered_doi,
  hasNotebook,
  entity_type,
  hubmap_id,
  uuid,
}) {
  const { workspacesUsers, userEmail } = useContext(AppContext);

  const createNotebook = useCallback(
    async ({ workspaceName }) => {
      const response = await fetch(`/notebooks/${entity_type.toLowerCase()}/${uuid}.ws.ipynb`, {
        method: 'POST',
        body: JSON.stringify({ workspace_name: workspaceName }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Create workspace failed', response);
        return;
      }

      const json = await response.json();
      const { workspace_id, notebook_path } = json;
      window.open(`/workspaces/${workspace_id}?notebook_path=${encodeURIComponent(notebook_path)}`, '_blank');
    },
    [entity_type, uuid],
  );

  return (
    <>
      <SummaryItem>
        <LightBlueLink variant="h6" href="https://software.docs.hubmapconsortium.org/assays" underline="none">
          {mapped_data_types}
        </LightBlueLink>
      </SummaryItem>
      <SummaryItem showDivider={Boolean(doi_url)}>
        <LightBlueLink variant="h6" href="/organ" underline="none">
          {origin_sample.mapped_organ}
        </LightBlueLink>
      </SummaryItem>
      {doi_url && (
        <OutboundIconLink isOutbound href={doi_url} variant="h6" iconFontSize="1.1rem">
          doi:{registered_doi}
        </OutboundIconLink>
      )}
      {workspacesUsers.includes(userEmail) && (
        <>
          <CreateWorkspaceDialog
            handleCreateWorkspace={createNotebook}
            buttonComponent={NotebookButton}
            disabled={!hasNotebook}
            defaultName={`${hubmap_id} Workspace`}
          />
        </>
      )}
    </>
  );
}

const entityStoreSelector = (state) => state.setAssayMetadata;

function DatasetDetail({ assayMetadata, vitData, hasNotebook, visLiftedUUID }) {
  const {
    protocol_url,
    metadata,
    files,
    donor,
    source_sample,
    uuid,
    data_types,
    mapped_data_types,
    origin_sample,
    origin_sample: { mapped_organ },
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    hubmap_id,
    entity_type,
    created_timestamp,
    last_modified_timestamp,
    published_timestamp,
    description,
    status,
    sub_status,
    mapped_data_access_level,
    mapped_external_group_name,
    registered_doi,
    doi_url,
    contributors,
  } = assayMetadata;
  const isLatest = !('next_revision_uuid' in assayMetadata);

  const combinedStatus = getCombinedDatasetStatus({ sub_status, status });

  const combinedMetadata = combineMetadata(donor, origin_sample, source_sample, metadata);

  const collectionsData = useDatasetCollections(uuid);

  const shouldDisplaySection = {
    provenance: entity_type !== 'Support',
    visualization: Boolean(vitData),
    protocols: Boolean(protocol_url),
    metadata: Boolean(Object.keys(combinedMetadata).length),
    files: true,
    collections: Boolean(collectionsData.length),
    contributors: contributors && Boolean(contributors.length),
  };

  const sectionOrder = getSectionOrder(
    [
      'summary',
      'visualization',
      'provenance',
      'protocols',
      'metadata',
      'files',
      'collections',
      'contributors',
      'attribution',
    ],
    shouldDisplaySection,
  );

  useSendUUIDEvent(entity_type, uuid);

  const setAssayMetadata = useEntityStore(entityStoreSelector);
  useEffect(() => {
    setAssayMetadata({ hubmap_id, entity_type, mapped_data_types, mapped_organ });
  }, [setAssayMetadata, hubmap_id, entity_type, mapped_data_types, mapped_organ]);

  // TODO: When all environments are clean, data_types array fallbacks shouldn't be needed.
  return (
    <DetailContext.Provider value={{ hubmap_id, uuid, mapped_data_access_level }}>
      {!isLatest && (
        <DetailPageAlert severity="warning" $marginBottom="16">
          <span>
            {/* <span> to override "display: flex" which splits this on to multiple lines. */}
            You are viewing an older version of this page. Navigate to the{' '}
            <LightBlueLink href={`/browse/latest/dataset/${uuid}`}>latest version</LightBlueLink>.
          </span>
        </DetailPageAlert>
      )}
      {mapped_external_group_name && (
        <DetailPageAlert severity="info" $marginBottom="16">
          You are viewing an external dataset that was not generated by the HuBMAP Consortium.
        </DetailPageAlert>
      )}
      {entity_type === 'Support' && <SupportAlert uuid={uuid} />}
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          hubmap_id={hubmap_id}
          created_timestamp={created_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          published_timestamp={published_timestamp}
          description={description}
          status={combinedStatus}
          mapped_data_access_level={mapped_data_access_level}
          mapped_external_group_name={mapped_external_group_name}
        >
          <SummaryDataChildren
            data_types={data_types || []}
            mapped_data_types={mapped_data_types || []}
            origin_sample={origin_sample}
            registered_doi={registered_doi}
            doi_url={doi_url}
            hasNotebook={hasNotebook}
            entity_type={entity_type}
            uuid={uuid}
            hubmap_id={hubmap_id}
          />
        </Summary>
        {shouldDisplaySection.visualization && (
          <VisualizationWrapper vitData={vitData} uuid={uuid} hasNotebook={hasNotebook} />
        )}
        {shouldDisplaySection.provenance && <ProvSection uuid={uuid} assayMetadata={assayMetadata} />}
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataTable metadata={combinedMetadata} hubmap_id={hubmap_id} />}
        <Files files={files} uuid={uuid} hubmap_id={hubmap_id} visLiftedUUID={visLiftedUUID} />
        {shouldDisplaySection.collections && <CollectionsSection collectionsData={collectionsData} />}
        {shouldDisplaySection.contributors && <ContributorsTable contributors={contributors} title="Contributors" />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default DatasetDetail;
