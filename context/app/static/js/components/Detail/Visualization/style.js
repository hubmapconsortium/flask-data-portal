import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SectionContainer from '../SectionContainer';

const headerFixedHeight = 64;
const vitessceFixedHeight = 600;

const StyledSectionContainer = styled(SectionContainer)`
  z-index: 3;
`;

const ExpandButton = styled(Button)`
  float: right;
`;

const TopSnackbar = styled(Snackbar)`
  top: ${headerFixedHeight + 10}px;
`;

const ExpandableDiv = styled.div`
  top: ${(props) => (props.$isExpanded ? `${headerFixedHeight}px` : 'auto')};
  left: ${(props) => (props.$isExpanded ? '0' : 'auto')};
  position: ${(props) => (props.$isExpanded ? 'fixed' : 'relative')};
  height: ${(props) => (props.$isExpanded ? `calc(100vh - ${headerFixedHeight}px)` : `${vitessceFixedHeight}px`)};
  width: 100%;
  overflow: hidden;
  background-color: white;
  .vitessce-container {
    display: block;
    height: ${(props) => (props.$isExpanded ? `calc(100vh - ${headerFixedHeight}px)` : 'auto')};
    width: 100%;
  }
`;

const StyledFooterText = styled(Typography)`
  line-height: 1.5;
  text-align: right;
`;

const bodyExpandedCSS = `
  body {
    overflow: hidden;
  }
`;

export {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledSectionContainer,
  ExpandButton,
  TopSnackbar,
  ExpandableDiv,
  StyledFooterText,
};
