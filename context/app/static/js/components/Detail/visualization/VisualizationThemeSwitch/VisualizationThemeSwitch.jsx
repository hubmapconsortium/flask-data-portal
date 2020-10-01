import React from 'react';
import WbSunnyIcon from '@material-ui/icons/WbSunnyRounded';
import Brightness2Icon from '@material-ui/icons/Brightness2Rounded';

import { TooltipToggleButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledToggleButtonGroup } from './style';
import 'vitessce/dist/es/production/static/css/index.css';

function VisualizationThemeSwitch(props) {
  const { theme, onChange } = props;
  return (
    <StyledToggleButtonGroup value={theme} exclusive onChange={onChange} size="small">
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Light Theme"
        disableRipple
        value="light"
        aria-label="Visualization light theme button"
      >
        <WbSunnyIcon color={theme === 'light' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
      <TooltipToggleButton
        tooltipComponent={SecondaryBackgroundTooltip}
        tooltipTitle="Switch to Dark Theme"
        disableRipple
        value="dark"
        aria-label="Visualization dark theme button"
      >
        <Brightness2Icon color={theme !== 'light' ? 'primary' : 'secondary'} />
      </TooltipToggleButton>
    </StyledToggleButtonGroup>
  );
}

export default VisualizationThemeSwitch;
