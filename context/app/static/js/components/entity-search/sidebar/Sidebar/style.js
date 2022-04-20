import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const SidebarLayout = styled(Paper)`
  width: 20%;
  margin-right: ${(props) => props.theme.spacing(2)}px;
`;

export { SidebarLayout };
