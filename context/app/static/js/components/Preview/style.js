import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import Paper from '@material-ui/core/Paper';
import InfoIcon from '@material-ui/icons/Info';

const StyledMarkdown = styled(ReactMarkdown)`
  li {
    list-style: circle;
    list-style-type: disc;
  }
`;
const StyledPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;
const StyledInfoIcon = styled(InfoIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledMarkdown, StyledPaper, StyledInfoIcon };
