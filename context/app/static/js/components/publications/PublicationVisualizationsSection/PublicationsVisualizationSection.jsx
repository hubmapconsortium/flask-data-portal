import Accordion from '@material-ui/core/Accordion';
import Typography from '@material-ui/core/Typography';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';
import React, { useCallback, useMemo, useState } from 'react';

import { DetailPageSection } from 'js/components/detailPage/style';
import PublicationVignette from 'js/components/publications/PublicationVignette';
import PrimaryColorAccordionSummary from 'js/shared-styles/accordions/PrimaryColorAccordionSummary';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { StyledAccordionDetails } from './style';

function PublicationsVisualizationSection({ vignette_json: { vignettes }, uuid }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const [displayedVignettes, setDisplayedVignettes] = useState({
    ...[true].concat(Array(vignettes.length - 1).fill(false)),
  });

  const sortedVignettes = useMemo(() => {
    return vignettes.sort((a, b) => a.directory_name.localeCompare(b.directory_name));
  }, [vignettes]);

  const handleChange = useCallback((i) => (event, isExpanded) => setExpandedIndex(isExpanded ? i : false), []);

  return (
    <DetailPageSection id="visualizations">
      <SectionHeader>Visualizations</SectionHeader>
      {sortedVignettes.map((vignette, i) => {
        return (
          <Accordion
            key={vignette.name}
            expanded={i === expandedIndex}
            TransitionProps={{ onEntered: () => setDisplayedVignettes((prev) => ({ ...prev, [i]: true })) }}
            onChange={handleChange(i)}
          >
            <PrimaryColorAccordionSummary $isExpanded={i === expandedIndex} expandIcon={<ArrowDropUpRoundedIcon />}>
              <Typography variant="subtitle1">{`Vignette ${i + 1}: ${vignette.name}`}</Typography>
            </PrimaryColorAccordionSummary>
            <StyledAccordionDetails>
              <PublicationVignette
                vignette={vignette}
                uuid={uuid}
                vignetteDirName={vignette.directory_name}
                mounted={displayedVignettes[i]}
              />
            </StyledAccordionDetails>
          </Accordion>
        );
      })}
    </DetailPageSection>
  );
}

export default PublicationsVisualizationSection;
