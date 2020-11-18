import React from 'react';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import Description from 'js/shared-styles/sections/Description';
import ServiceStatusTable from 'js/components/ServiceStatusTable';
import { LightBlueLink } from 'js/shared-styles/Links';
import { gatewayUrl } from 'js/components/ServiceStatusTable/hooks';

function Services() {
  return (
    <>
      <SectionContainer id="summary">
        <SectionHeader variant="h1" component="h1">
          Services
        </SectionHeader>
        <Description>
          {'HuBMAP is powered by a number of APIs. Status information provided by '}
          <LightBlueLink target="_blank" rel="noopener noreferrer" underline="none" href={gatewayUrl}>
            {new URL(gatewayUrl).hostname}
          </LightBlueLink>
          .
        </Description>
      </SectionContainer>
      <Paper>
        <ServiceStatusTable />
      </Paper>
    </>
  );
}

export default Services;
