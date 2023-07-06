import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

const StyledList = styled(List)`
  padding: 0px;
`;

const FacetLabel = styled(Typography)`
  padding: 6px 16px;
`;

const FacetValue = styled(Typography)`
  padding: 6px 16px;
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: block;
  color: ${(props) => props.theme.palette.text.primary};

  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
`;

export { StyledList, FacetLabel, FacetValue };