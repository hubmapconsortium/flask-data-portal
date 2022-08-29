import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import SectionItem from 'js/components/detailPage/SectionItem';
import { LightBlueLink } from 'js/shared-styles/Links';
import ShowDerivedEntitiesButton from 'js/components/detailPage/provenance/ShowDerivedEntitiesButton';
import useProvenanceStore from 'js/stores/useProvenanceStore';
import ProvVis from '../ProvVis';
import { StyledPaper, Flex, StyledTypography } from './style';
import '@hms-dbmi-bgm/react-workflow-viz/dist/react-workflow-viz.min.css';

const provenanceStoreSelector = (state) => state.setUUID;

function ProvGraph({ provData, entity_type, uuid }) {
  const isOld = 'ex' in provData.prefix;
  const idKey = isOld ? 'hubmap:displayDOI' : 'hubmap:hubmap_id';
  const timeKey = isOld ? 'prov:generatedAtTime' : 'hubmap:created_timestamp';
  const typeKey = isOld ? 'prov:type' : 'hubmap:entity_type';

  const setUUID = useProvenanceStore(provenanceStoreSelector);

  useEffect(() => {
    setUUID(uuid);
  }, [setUUID, uuid]);

  function getNameForActivity(id, prov) {
    const activity = prov.activity[id];
    return `${activity['hubmap:creation_action']} - ${activity[idKey]}`;
  }

  function getNameForEntity(id, prov) {
    const entity = prov.entity[id];
    // NOTE: The initial entity node was not included in the sample data;
    // Fallback to ID, if needed. https://github.com/hubmapconsortium/prov-vis/issues/15
    return entity ? `${entity[typeKey]} - ${entity[idKey]}` : id;
  }

  function renderDetailPane(node) {
    function DetailPanel() {
      const { prov } = node.meta;

      const typeEl =
        typeKey in prov ? (
          <SectionItem label="Type">{prov[typeKey]}</SectionItem>
        ) : (
          <SectionItem label="Type">{prov['prov:type']}</SectionItem>
        );
      const entityTypes = ['Donor', 'Sample', 'Dataset', 'Support'];
      const idEl =
        typeKey in prov && entityTypes.includes(prov[typeKey]) ? (
          <SectionItem label="ID" ml>
            <LightBlueLink href={`/browse/${prov[typeKey].toLowerCase()}/${prov['hubmap:uuid']}`}>
              {prov[idKey]}
            </LightBlueLink>
          </SectionItem>
        ) : null;
      const createdEl =
        timeKey in prov ? (
          <SectionItem label="Created" ml>
            {prov[timeKey]}
          </SectionItem>
        ) : null;
      const actionsEl =
        typeKey in prov && entityTypes.includes(prov[typeKey]) ? (
          <SectionItem ml>
            <ShowDerivedEntitiesButton
              id={prov[idKey]}
              getNameForActivity={getNameForActivity}
              getNameForEntity={getNameForEntity}
            />
          </SectionItem>
        ) : null;
      return (
        <StyledPaper>
          <Flex>
            {typeEl}
            {idEl}
            {createdEl}
            {actionsEl}
          </Flex>
          {uuid === node.meta.prov['hubmap:uuid'] && (
            <StyledTypography>* Indicates Current Entity Node</StyledTypography>
          )}
        </StyledPaper>
      );
    }
    return node?.meta?.prov && <DetailPanel />;
  }

  return (
    <ProvVis
      provData={provData}
      getNameForActivity={getNameForActivity}
      getNameForEntity={getNameForEntity}
      renderDetailPane={renderDetailPane}
      entity_type={entity_type}
    />
  );
}

ProvGraph.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ProvGraph;
