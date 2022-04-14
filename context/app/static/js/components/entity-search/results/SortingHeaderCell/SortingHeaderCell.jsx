import React from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';

import { useSortField } from './hooks';

function SortingHeaderCell({ field, children }) {
  const { sortDirection, toggleSort } = useSortField(field);
  return (
    <TableCell sortDirection={sortDirection}>
      <TableSortLabel active direction={sortDirection} onClick={toggleSort} />
      {children}
      <TableSortLabel />
    </TableCell>
  );
}

export default SortingHeaderCell;
