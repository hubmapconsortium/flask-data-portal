import styled from 'styled-components';
import GetAppIcon from '@material-ui/icons/GetAppRounded';
import TableCell from '@material-ui/core/TableCell';
import { InfoIcon } from 'js/shared-styles/icons';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import SectionHeader from '../SectionHeader';

const DownloadIcon = styled(GetAppIcon)`
  font-size: 25px;
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledWhiteBackgroundIconButton = styled(WhiteBackgroundIconButton)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledSectionHeader = styled(SectionHeader)`
  align-self: flex-end;
`;

const FlexTableCell = styled(TableCell)`
  display: flex;
  align-items: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
  font-size: 14px;
`;

export { DownloadIcon, Flex, StyledWhiteBackgroundIconButton, StyledSectionHeader, FlexTableCell, StyledInfoIcon };
