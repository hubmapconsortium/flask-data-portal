import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

function buildNLMCitation({ contributors, citationTitle, created_timestamp }) {
  const joinedContributors = contributors
    .map(({ last_name, first_name }) => `${last_name} ${first_name[0]}`)
    .join(', ');
  const year = new Date(created_timestamp).getFullYear();
  return `${joinedContributors}. ${citationTitle} [Internet]. HuBMAP Consortium; ${year}.`;
}

function Citation({ contributors, citationTitle, created_timestamp, doi_url, doi, className }) {
  const citation = buildNLMCitation({ contributors, citationTitle, created_timestamp });

  return (
    <LabelledSectionText
      label="Citation"
      iconTooltipText="Citation is provided in NLM format. If DataCite page is available, click button to view alternate ways to cite."
      className={className}
      bottomSpacing={1}
    >
      <Typography variant="body1" component="span">
        {citation} Available from: <OutboundIconLink href={doi_url}>{doi_url}</OutboundIconLink>
      </Typography>
      <br />
      <OutboundIconLink href={`https://search.datacite.org/works/${doi}`}>View DataCite Page</OutboundIconLink>
    </LabelledSectionText>
  );
}

Citation.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  contributors: PropTypes.array.isRequired,
  citationTitle: PropTypes.string.isRequired,
  created_timestamp: PropTypes.number.isRequired,
  doi_url: PropTypes.string.isRequired,
  doi: PropTypes.string.isRequired,
};

export default Citation;
export { buildNLMCitation };
