import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import Typography from '@material-ui/core/Typography';

import { DetailPageAlert } from 'js/shared-styles/alerts';

function SupportAlert({ uuid }) {
  // There should usually be only one parent, but this is more robust, and we want to keep it simple.
  return (
    <DetailPageAlert severity="warning">
      <Typography variant="body2">
        “Support” entities provide derived, low-level data for visualizations. Navigate to{' '}
        <LightBlueLink href={`/search?descendant_ids[0]=${uuid}&entity_type[0]=Dataset`}>
          the parent dataset
        </LightBlueLink>{' '}
        for a view of this information in context.
      </Typography>
    </DetailPageAlert>
  );
}

export default SupportAlert;
