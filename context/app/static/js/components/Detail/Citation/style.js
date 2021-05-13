import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { InfoIcon } from 'js/shared-styles/icons';

const FlexPaper = styled(Paper)`
  padding: 30px 40px;
`;

const Flex = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
`;

const StyledSectionHeader = styled(SectionHeader)`
  display: flex;
  align-items: center;
`;

export { FlexPaper, Flex, FlexRight, StyledInfoIcon, StyledSectionHeader };
