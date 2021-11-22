import React from 'react';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import SectionItem from 'js/components/detailPage/SectionItem';

import { StyledSectionPaper, ChartTitle } from './style';

function ProjectAttribution() {
  return (
    <SectionContainer>
      <ChartTitle variant="h4" component="h2">
        Attribution
      </ChartTitle>
      <StyledSectionPaper>
        <SectionItem label="Creator">Roselkis Morla-Adames</SectionItem>
        <SectionItem label="PI" ml={1}>
          Nils Gehlenborg
        </SectionItem>
        <SectionItem label="Funding" ml={1}>
          NIH HuBMAP Underepresented Student Internship
        </SectionItem>
      </StyledSectionPaper>
    </SectionContainer>
  );
}

export default ProjectAttribution;
