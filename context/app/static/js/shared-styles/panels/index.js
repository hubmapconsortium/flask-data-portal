import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { capitalizeString } from 'js/helpers/functions';
import { LightBlueLink } from 'js/shared-styles/Links';

const overflowCss = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PanelWrapper = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const MaxWidthDiv = styled.div`
  max-width: 900px;
`;

const TruncatedText = styled(Typography)`
  ${overflowCss};
`;

const TruncatedLink = styled(LightBlueLink)`
  ${overflowCss};
`;

const StyledTypography = styled(Typography)`
  margin-left: ${(props) => props.theme.spacing(0.5)}px;
`;

const PanelScrollBox = styled(Paper)`
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-grow: 1;
    overflow-y: scroll;
    margin-top: ${(props) => props.theme.spacing(1)}px;
  }
`;

function Panel(props) {
  const { title, href, secondaryText, entityCounts } = props;
  return (
    <PanelWrapper>
      <MaxWidthDiv>
        <TruncatedLink variant="subtitle1" href={href}>
          {title}
        </TruncatedLink>
        <TruncatedText variant="body2" color="secondary">
          {secondaryText}
        </TruncatedText>
      </MaxWidthDiv>
      <div>
        {Object.entries(entityCounts).map(([key, value]) => (
          <StyledTypography key={key} variant="caption">{`${value} ${capitalizeString(key)}`}</StyledTypography>
        ))}
      </div>
    </PanelWrapper>
  );
}

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  entityCounts: PropTypes.shape({
    donors: PropTypes.number,
    samples: PropTypes.number,
    datasets: PropTypes.number,
  }),
};

Panel.defaultProps = {
  secondaryText: '',
  entityCounts: {},
};

export { Panel, PanelScrollBox };
