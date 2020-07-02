import React from 'react';

import FileBrowserDirectory from '../FileBrowserDirectory';
import FileBrowserFile from '../FileBrowserFile';
import { Column } from './style';

function FileBrowserNode(props) {
  const { fileSubTree, depth } = props;
  return Object.entries(fileSubTree).map(([k, v]) => {
    if (k === 'files') {
      return (
        <Column key={`${k}-${depth}`}>
          {v.map((file) => (
            <FileBrowserFile key={file.rel_path} fileObj={file} depth={depth} />
          ))}
        </Column>
      );
    }
    return (
      <FileBrowserDirectory key={`${k}-${depth}`} dirName={k.slice(0, -1)} depth={depth}>
        <FileBrowserNode fileSubTree={v} depth={depth + 1} />
      </FileBrowserDirectory>
    );
  });
}

export default FileBrowserNode;
