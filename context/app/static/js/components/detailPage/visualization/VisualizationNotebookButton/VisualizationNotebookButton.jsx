import React from 'react';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import styled from 'styled-components';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

// TODO: Would it be ok to create visualization/style.js and put this there,
// so all the buttons would use it?
// Individual buttons padding on the left and right seems fragile, if they get rearranged.
const StyledSecondaryBackgroundTooltip = styled(SecondaryBackgroundTooltip)`
  margin: 0 ${(props) => props.theme.spacing(1)}px;
`;

function VisualizationNotebookButton({ uuid }) {
  return (
    <StyledSecondaryBackgroundTooltip title="Download Jupyter Notebook">
      <WhiteBackgroundIconButton component="a" href={`${uuid}.ipynb`}>
        <GetAppRoundedIcon color="primary" />
      </WhiteBackgroundIconButton>
    </StyledSecondaryBackgroundTooltip>
  );
}

export default VisualizationNotebookButton;
