import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SectionContainer from '../SectionContainer';

const headerFixedHeight = 64;
const vitessceFixedHeight = 600;

const StyledHeader = styled.div`
  margin-bottom: 6px;
  display: flex;
`;

const StyledHeaderLeft = styled.div`
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
`;

const StyledHeaderText = styled(Typography)`
  margin-bottom: 0;
  display: inline-block;
`;

const StyledHeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  margin-top: 2rem;
`;

const StyledSectionContainer = styled(SectionContainer)`
  z-index: 3;
  position: relative;
`;

const ExpandButton = styled(Button)`
  display: inline-block;
  margin-left: 0.5rem;
  svg {
    vertical-align: middle;
  }
`;

const SelectionButton = styled(Button)`
  color: black;
`;

const TopSnackbar = styled(Snackbar)`
  top: ${headerFixedHeight + 10}px;
  & > div {
    background-color: dimgray;
  }
`;

const ExpandableDiv = styled.div`
  top: ${(props) => (props.$isExpanded ? `${headerFixedHeight}px` : 'auto')};
  left: ${(props) => (props.$isExpanded ? '0' : 'auto')};
  position: ${(props) => (props.$isExpanded ? 'fixed' : 'relative')};
  height: ${(props) => (props.$isExpanded ? `calc(100vh - ${headerFixedHeight}px)` : `${vitessceFixedHeight}px`)};
  background-color: ${(props) => (props.$theme === 'dark' ? '#333333' : '#FFFFFF')};
  width: 100%;
  overflow: hidden;
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
  StyledHeader,
  StyledHeaderText,
  StyledHeaderRight,
  StyledHeaderLeft,
  ExpandButton,
  TopSnackbar,
  ExpandableDiv,
  StyledFooterText,
  SelectionButton,
};
