import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import useAbortableEffect from 'js/hooks/useAbortableEffect';
import { StyledTypography, Flex, StyledErrorIcon, StyledSuccessIcon } from './style';
import GlobusLinkMessage from '../GlobusLinkMessage';

function GlobusLink(props) {
  const { uuid, hubmap_id, isSupport } = props;
  const [globusUrlStatus, setGlobusUrlStatus] = React.useState({ url: '', statusCode: null });

  const { entityEndpoint, nexusToken } = useContext(AppContext);

  const requestHeaders = getAuthHeader(nexusToken);
  useAbortableEffect(
    (status) => {
      async function getAndSetGlobusUrlStatus() {
        const response = await fetch(`${entityEndpoint}/entities/dataset/globus-url/${uuid}`, {
          headers: requestHeaders,
        });
        if (!response.ok) {
          console.error('Entities API failed', response);
          if (!status.aborted) {
            setGlobusUrlStatus({ url: null, statusCode: response.status });
          }
          return;
        }
        const responseGlobusUrl = await response.text();
        if (!status.aborted) {
          setGlobusUrlStatus({ url: responseGlobusUrl, statusCode: response.status });
        }
      }
      getAndSetGlobusUrlStatus();
    },
    [entityEndpoint, uuid],
  );

  const { statusCode, url } = globusUrlStatus;

  return (
    statusCode && (
      <>
        <Flex>
          {statusCode === 200 ? (
            <StyledSuccessIcon data-testid="success-icon" />
          ) : (
            <StyledErrorIcon data-testid="error-icon" />
          )}
          <StyledTypography variant="h6">Bulk Data Transfer {isSupport && '(Support)'}</StyledTypography>
        </Flex>
        <GlobusLinkMessage statusCode={statusCode} url={url} hubmap_id={hubmap_id} isSupport={isSupport} />
      </>
    )
  );
}

GlobusLink.propTypes = {
  uuid: PropTypes.string.isRequired,
  hubmap_id: PropTypes.string,
  isSupport: PropTypes.bool,
};

GlobusLink.defaultProps = {
  isSupport: false,
  hubmap_id: '',
};

export default GlobusLink;
