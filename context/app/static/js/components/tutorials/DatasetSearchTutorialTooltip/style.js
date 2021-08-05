import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const StyledPaper = styled(Paper)`
  max-width: 450px;
  padding: 15px;
  background-color: ${(props) => props.theme.palette.info.dark};
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const WhiteTypography = styled(Typography)`
  color: #fff;
`;

const WhiteCloseRoundedIcon = styled(CloseRoundedIcon)`
  color: #fff;
`;

export { StyledPaper, Flex, FlexEnd, WhiteTypography, WhiteCloseRoundedIcon };
