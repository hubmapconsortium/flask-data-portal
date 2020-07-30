import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Logo from 'images/hubmap-logo.svg';

const FlexContainer = styled(Container)`
  margin-top: ${(props) => props.theme.spacing(4)}px;
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: top;
`;

const Flex = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(4)}px;
  flex-wrap: wrap;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${(props) => (props.$mr ? props.theme.spacing(10) : '0')}px;
`;

const HubmapLogo = styled(Logo)`
  height: 29px;
  fill: ${(props) => props.theme.palette.primary.main};
`;

// To account for the line height of the other text
const LogoWrapper = styled.div`
  margin-top: 5px;
`;

const Background = styled.div`
  background-color: #fff;
  width: 100%;
`;

export { FlexContainer, Flex, FlexColumn, HubmapLogo, LogoWrapper, Background };
