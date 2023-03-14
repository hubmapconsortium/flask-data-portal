/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import PanelList from 'js/shared-styles/panels/PanelList';
import { Tab } from 'js/shared-styles/tabs';
import { usePublications } from './hooks';

import { StyledTabs, StyledTabPanel } from './style';

const Description = () => (
  <>
    The following publications are a partial list of published HuBMAP research that uses data available through the
    HuBMAP Data Portal. The full list of HuBMAP-funded publications is available on{' '}
    <LightBlueLink href="https://scholar.google.com/citations?user=CtGSN80AAAAJ&hl=en">Google Scholar</LightBlueLink>.
    Publication pages will have a summary of publication-related information, a list of referenced HuBMAP datasets and
    vignettes of relevant visualizations.
  </>
);

function Publications() {
  const { publicationsPanelsPropsSeparatedByStatus, publicationsCount } = usePublications();

  const [openTabIndex, setOpenTabIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setOpenTabIndex(newIndex);
  };

  return (
    <PanelListLandingPage
      title="Publications"
      subtitle={publicationsCount > 0 && `${publicationsCount} Publications`}
      description={<Description />}
    >
      <StyledTabs value={openTabIndex} onChange={handleChange} aria-label="Published and preprint publications">
        {Object.entries(publicationsPanelsPropsSeparatedByStatus).map(([publicationStatus, panelsProps], i) => (
          <Tab
            label={`${publicationStatus} (${panelsProps.length})`}
            index={i}
            key={publicationStatus}
            disabled={panelsProps.length === 0}
          />
        ))}
      </StyledTabs>
      {Object.entries(publicationsPanelsPropsSeparatedByStatus).map(([publicationStatus, panelsProps], i) => (
        <StyledTabPanel value={openTabIndex} index={i} key={publicationStatus}>
          <PanelList panelsProps={panelsProps} />
        </StyledTabPanel>
      ))}
    </PanelListLandingPage>
  );
}

export default Publications;
