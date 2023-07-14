import React from 'react';
import Divider from '@material-ui/core/Divider';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useFilesContext } from 'js/components/detailPage/files/Files/context';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import FilesConditionalLink from './FilesConditionalLink';
import { StyledExternalLinkIcon, LinkContainer, StyledLink } from './style';
import { useFetchProtectedFile } from './hooks';

function GlobusLink({ uuid, isSupport }) {
  const {
    entity: { hubmap_id },
  } = useFlaskDataContext();

  const { status, responseUrl } = useFetchProtectedFile(uuid);
  const { hasAgreedToDUA, openDUA } = useFilesContext();

  if (!status) {
    return <DetailSectionPaper>Loading...</DetailSectionPaper>;
  }

  return (
    <>
      <Divider />
      <LinkContainer>
        {isSupport && 'Support Dataset'}
        <StyledLink variant="body1">
          <FilesConditionalLink
            href={responseUrl}
            hasAgreedToDUA={hasAgreedToDUA}
            openDUA={() => openDUA(responseUrl)}
            variant="body2"
          >
            {isSupport ? ': ' : hubmap_id}
            <SecondaryBackgroundTooltip title="Data generated for visualization of this dataset are also available on Globus.">
              <span>
                {' '}
                Globus
                <StyledExternalLinkIcon />
              </span>
              {/*  */}
            </SecondaryBackgroundTooltip>
          </FilesConditionalLink>
        </StyledLink>
      </LinkContainer>
    </>
  );
}

function GlobusLinkContainer() {
  const {
    entity: { uuid },
    vis_lifted_uuid,
  } = useFlaskDataContext();

  return (
    <>
      <GlobusLink uuid={uuid} />
      {vis_lifted_uuid && <GlobusLink uuid={vis_lifted_uuid} isSupport />}
    </>
  );
}

export default GlobusLinkContainer;
