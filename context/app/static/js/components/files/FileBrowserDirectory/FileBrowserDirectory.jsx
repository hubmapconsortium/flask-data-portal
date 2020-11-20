import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ArrowRightRoundedIcon from '@material-ui/icons/ArrowRightRounded';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';

import useFilesStore from 'js/stores/useFilesStore';
import { StyledTableRow, Directory, StyledFolderIcon, StyledFolderOpenIcon } from './style';

const filesStoreSelector = (state) => state.displayOnlyQaQc;

function FileBrowserDirectory(props) {
  const { dirName, children, depth } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13 /* carriage return */) {
      setIsExpanded(!isExpanded);
    }
  };

  const displayOnlyQaQc = useFilesStore(filesStoreSelector);

  useEffect(() => {
    if (displayOnlyQaQc === true) {
      setIsExpanded(true);
      return;
    }
    setIsExpanded(false);
  }, [displayOnlyQaQc]);

  return (
    <>
      <StyledTableRow
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={onKeyDownHandler}
        role="button"
        tabIndex="0"
      >
        <td>
          <Directory $depth={depth}>
            {isExpanded ? (
              <>
                <ArrowDropDownRoundedIcon color="secondary" />
                <StyledFolderOpenIcon color="primary" />
              </>
            ) : (
              <>
                <ArrowRightRoundedIcon color="secondary" />
                <StyledFolderIcon color="primary" />
              </>
            )}
            {dirName}
          </Directory>
        </td>
        <td />
        <td />
      </StyledTableRow>
      {isExpanded && children}
    </>
  );
}

FileBrowserDirectory.propTypes = {
  dirName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  depth: PropTypes.number.isRequired,
};

export default FileBrowserDirectory;
