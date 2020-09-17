import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'js/components/Providers';
import useProvData from 'js/hooks/useProvData';
import { Alert } from 'js/shared-styles/alerts';
import ProvTabs from '../ProvTabs';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';

function ProvSection(props) {
  const { uuid, assayMetadata } = props;
  const { entity_type } = assayMetadata;
  const { nexusToken, entityEndpoint } = useContext(AppContext);
  const { provData, isLoading } = useProvData(uuid, entityEndpoint, nexusToken);

  if (isLoading) {
    return (
      <SectionContainer id="provenance">
        <SectionHeader>Provenance</SectionHeader>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="provenance">
      <SectionHeader>Provenance</SectionHeader>
      {provData ? (
        <ProvTabs uuid={uuid} assayMetadata={assayMetadata} provData={provData} />
      ) : (
        <Alert severity="warning">
          {`We were unable to retrieve provenance information for this ${entity_type.toLowerCase()}.`}
        </Alert>
      )}
    </SectionContainer>
  );
}

ProvSection.propTypes = {
  uuid: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assayMetadata: PropTypes.object.isRequired,
};

export default ProvSection;
