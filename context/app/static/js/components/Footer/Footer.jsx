import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { FlexContainer, Flex, FlexColumn, HubmapLogo, LogoWrapper, Background } from './style';

function Footer(props) {
  const { isMaintenancePage } = props;
  return (
    <Background>
      <FlexContainer maxWidth="lg">
        <LogoWrapper>
          <HubmapLogo />
        </LogoWrapper>
        <div>
          <Flex>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">About</Typography>
              <OutboundLink href="https://hubmapconsortium.org/" target="_blank" variant="body2">
                Project Website
              </OutboundLink>
              {!isMaintenancePage && (
                <LightBlueLink href="/docs" variant="body2">
                  Documentation
                </LightBlueLink>
              )}
              <LightBlueLink variant="body2" href="mailto:help@hubmapconsortium.org">
                Submit Feedback
              </LightBlueLink>
            </FlexColumn>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">Software</Typography>
              <OutboundLink variant="body2" href="https://github.com/hubmapconsortium">
                GitHub
              </OutboundLink>
              <LightBlueLink variant="body2" href="/services">
                Services
              </LightBlueLink>
            </FlexColumn>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">Policies</Typography>
              <OutboundLink href="https://hubmapconsortium.org/policies/" target="_blank" variant="body2">
                Overview
              </OutboundLink>
              <OutboundLink
                href="https://hubmapconsortium.org/wp-content/uploads/2020/06/DUA_FINAL_2020_02_03_for_Signature.pdf"
                target="_blank"
                variant="body2"
              >
                Data Use Agreement
              </OutboundLink>
              {!isMaintenancePage && (
                <LightBlueLink href="/docs/about#citation" variant="body2">
                  Citing HuBMAP
                </LightBlueLink>
              )}
            </FlexColumn>
            <FlexColumn>
              <Typography variant="subtitle2">Funding</Typography>
              <OutboundLink href="https://commonfund.nih.gov/hubmap" target="_blank" variant="body2">
                NIH Common Fund
              </OutboundLink>
            </FlexColumn>
          </Flex>
          <Typography variant="body1" color="secondary">
            {'Copyright '}
            <OutboundLink href="https://hubmapconsortium.org" target="_blank">
              NIH Human BioMolecular Atlas Program (HuBMAP)
            </OutboundLink>{' '}
            {new Date().getFullYear()}
            {'. All rights reserved. '}
          </Typography>
        </div>
        <div />
      </FlexContainer>
    </Background>
  );
}

Footer.propTypes = {
  isMaintenancePage: PropTypes.bool,
};

Footer.defaultProps = {
  isMaintenancePage: false,
};

export default Footer;
