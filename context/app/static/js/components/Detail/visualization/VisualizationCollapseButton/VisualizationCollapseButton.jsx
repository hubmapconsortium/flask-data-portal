import React from 'react';
import FullscreenExitRoundedIcon from '@material-ui/icons/FullscreenExitRounded';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useVisualizationStore from 'js/stores/useVisualizationStore';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const visualizationStoreSelector = (state) => ({
  collapseViz: state.collapseViz,
});

function VisualizationCollapseButton() {
  const { collapseViz } = useVisualizationStore(visualizationStoreSelector);
  return (
    <SecondaryBackgroundTooltip title="Exit Fullscreen">
      <WhiteBackgroundIconButton onClick={() => collapseViz()}>
        <FullscreenExitRoundedIcon color="primary" />
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
  );
}

export default VisualizationCollapseButton;
