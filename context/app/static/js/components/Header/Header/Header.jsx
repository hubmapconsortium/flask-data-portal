import React, { useRef } from 'react';

import useStore from 'js/components/store';
import DetailHeader from 'js/components/Detail/Header';
import HeaderAppBar from '../HeaderAppBar';
import HeaderContent from '../HeaderContent';

function Header() {
  const anchorRef = useRef(null);
  const summaryInView = useStore((state) => state.summaryInView);
  const displayEntityHeader = !summaryInView && window.location.pathname.startsWith('/browse');

  return (
    <>
      <HeaderAppBar anchorRef={anchorRef} elevation={displayEntityHeader ? 0 : 4}>
        <HeaderContent anchorRef={anchorRef} />
      </HeaderAppBar>
      {displayEntityHeader && <DetailHeader />}
    </>
  );
}

export default Header;
