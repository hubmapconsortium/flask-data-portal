import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const Background = styled.div`
  background-color: ${(props) =>
    props.isMaintenancePage ? props.theme.palette.warning.main : props.theme.palette.error.main};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const StyledPaper = styled(Paper)`
  width: 100%;
  max-width: 880px;
  margin: 0px 16px;
  padding: 16px;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(props.$mb)}px;
`;

export { Background, StyledPaper, StyledTypography };
