import styled, { css } from 'styled-components';
import Paper from '@material-ui/core/Paper';
import FormLabel from '@material-ui/core/FormLabel';

import { scrollShadows } from 'js/shared-styles/scrollShadows';

const StyledPaper = styled(Paper)`
  min-width: 300px;
  padding: 16px 16px 16px 0px;
  overflow-y: auto;
  height: 100%;
  margin-right: ${(props) => props.theme.spacing(1.5)}px;
  ${scrollShadows};
`;

const StyledFormLabel = styled(FormLabel)`
  ${({ theme: { typography, palette, spacing } }) => css`
    font-weight: ${typography.subtitle1.fontWeight};
    font-size: ${typography.subtitle1.fontSize};
    color: ${palette.text.primary};
    margin-left: ${spacing(2)}px;
    margin-bottom: ${spacing(0.5)}px;
  `}
`;

export { StyledPaper, StyledFormLabel };
