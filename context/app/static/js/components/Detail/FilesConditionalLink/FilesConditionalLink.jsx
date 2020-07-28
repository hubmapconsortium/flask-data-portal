/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { LightBlueLink } from 'shared-styles/Links';
import { AlignedLink } from './style';

function FilesConditionalLink(props) {
  const { hasAgreedToDUA, openDUA, href, children, ...rest } = props;
  if (hasAgreedToDUA) {
    return (
      <LightBlueLink target="_blank" rel="noopener noreferrer" underline="none" href={href} {...rest}>
        {children}
      </LightBlueLink>
    );
  }
  return (
    <AlignedLink
      onClick={() => {
        openDUA();
      }}
      component="button"
      underline="none"
      {...rest}
    >
      {children}
    </AlignedLink>
  );
}

export default FilesConditionalLink;
