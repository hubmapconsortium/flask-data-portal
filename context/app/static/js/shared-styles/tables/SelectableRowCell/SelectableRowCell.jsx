import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';

function SelectableRowCell({ rowKey, index }) {
  const { toggleRow, selectedRows, tableLabel } = useStore();

  return (
    <TableCell padding="checkbox" onClick={() => toggleRow(rowKey)}>
      <Checkbox
        checked={selectedRows.has(rowKey)}
        inputProps={{ 'aria-labelledby': `${tableLabel}-row-${index}-checkbox` }}
      />
    </TableCell>
  );
}

SelectableRowCell.propTypes = {
  /**
   Unique key representing the table.
  */
  rowKey: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default SelectableRowCell;
