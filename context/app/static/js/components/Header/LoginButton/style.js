import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const WhiteButton = styled(Button)`
  width: 136px;
  background-color: #ffffff;
  margin-left: 10px;
  color: color: ${(props) => props.theme.palette.primary.main};
  text-transform: capitalize;

  &:hover {
    background-color: rgb(255, 255, 255, 0.92);
    box-shadow: ${(props) => props.theme.shadows[8]};
  }
`;

export { WhiteButton };
