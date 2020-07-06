import React, { useState, useEffect } from 'react';

import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ScrollPaper } from './style';

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});
  const [hasAgreedToDUA, agreeToDUA] = useState(false);

  useEffect(() => {
    const treePath = relativeFilePathsToTree(files);
    setFileTree(treePath);
  }, [files]);

  return (
    <ScrollPaper>
      <FileBrowserNode fileSubTree={fileTree} hasAgreedToDUA={hasAgreedToDUA} agreeToDUA={agreeToDUA} depth={0} />
    </ScrollPaper>
  );
}

export default FileBrowser;
