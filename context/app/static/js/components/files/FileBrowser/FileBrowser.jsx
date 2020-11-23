import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DoneIcon from '@material-ui/icons/Done';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Chip from '@material-ui/core/Chip';

import useFilesStore from 'js/stores/useFilesStore';
import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ChipWrapper, StyledTableContainer, HiddenTableHead } from './style';

const filesStoreSelector = (state) => ({
  displayOnlyQaQc: state.displayOnlyQaQc,
  toggleDisplayOnlyQaQc: state.toggleDisplayOnlyQaQc,
});

function FileBrowser(props) {
  const { files } = props;

  const { displayOnlyQaQc, toggleDisplayOnlyQaQc } = useFilesStore(filesStoreSelector);

  const fileTrees = useMemo(
    () => ({
      all: relativeFilePathsToTree(files),
      qa: relativeFilePathsToTree(files.filter((file) => file?.is_qa_qc)),
    }),
    [files],
  );

  return (
    <StyledTableContainer component={Paper}>
      <ChipWrapper>
        <Chip
          label="Show QA Files Only"
          clickable
          onClick={toggleDisplayOnlyQaQc}
          color={displayOnlyQaQc ? 'primary' : undefined}
          icon={displayOnlyQaQc && <DoneIcon />}
          component="button"
          disabled={Object.keys(fileTrees.qa).length === 0}
        />
      </ChipWrapper>
      <Table data-testid="file-browser">
        <HiddenTableHead>
          <TableRow>
            <td>Name</td>
            <td>Type</td>
            <td>Size</td>
          </TableRow>
        </HiddenTableHead>
        <TableBody>
          <FileBrowserNode fileSubTree={displayOnlyQaQc ? fileTrees.qa : fileTrees.all} depth={0} />
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

FileBrowser.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      rel_path: PropTypes.string,
      edam_term: PropTypes.string,
      description: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
      is_qa_qc: PropTypes.bool,
    }),
  ).isRequired,
};

export default FileBrowser;
