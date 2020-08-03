import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

// 88px = header height + header margin
const PageWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(5)}px;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    height: calc(100vh - 88px);
    display: flex;
    flex-direction: column;
  }
`;

const ScrollBox = styled(Paper)`
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-grow: 1;
    overflow-y: scroll;
    margin-top: ${(props) => props.theme.spacing(1)}px;
  }
`;

export { PageWrapper, ScrollBox };
