import styled from 'styled-components';

const LinkButton = styled.a`
  color: #ffffff;
  border-radius: 4px;
  background-color: ${(props) => props.theme.palette.primary.main};
  font-size: ${(props) => props.theme.typography.subtitle2.fontSize};
  font-weight: ${(props) => props.theme.typography.subtitle2.fontWeight};
  margin-top: ${(props) => props.theme.spacing(1)}px;
  width: 175px;
  box-sizing: content-box;
  padding: 8px 30px;
  text-align: center;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows[8]};
    filter: ${(props) => props.theme.palette.primary.hover};
  }
`;

export { LinkButton };
