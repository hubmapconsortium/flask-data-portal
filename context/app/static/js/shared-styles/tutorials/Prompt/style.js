import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { InfoIcon } from 'js/shared-styles/icons';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';

const CenteredDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 48px; /* to offset for the button size */
  padding: ${(props) => props.theme.spacing(1)}px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const StyledPaper = styled(Paper)`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
  padding: ${(props) => props.theme.spacing(0.5)}px;
  border: 1px solid ${(props) => props.theme.palette.info.dark};
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 1.5rem;
  color: ${(props) => props.theme.palette.info.dark};
`;

const StyledCloseIcon = styled(CloseRoundedIcon)`
  color: ${(props) => props.theme.palette.info.dark};
`;

const StyledButton = styled(OptDisabledButton)`
  padding: 6px 36px;
  background-color: ${(props) => props.theme.palette.info.dark};
  color: #fff;
`;

export { CenteredDiv, Flex, StyledTypography, StyledPaper, StyledInfoIcon, StyledCloseIcon, StyledButton };
