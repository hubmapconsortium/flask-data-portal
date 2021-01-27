import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import SavedEntitiesTableRow from 'js/components/savedLists/SavedEntitiesTableRow';
import DeleteSavedEntitiesDialog from 'js/components/savedLists/DeleteSavedEntitiesDialog';
import SaveToListDialog from 'js/components/savedLists/SaveToListDialog';
import useStateSet from 'js/hooks/useStateSet';
import { Flex } from './style';

const columns = [
  { id: 'display_doi', label: 'HuBMAP ID' },
  { id: 'entity_type', label: 'Entity Type' },
  { id: 'group_name', label: 'Group' },
  { id: 'dateSaved', label: 'Date Saved' },
];

const useSavedEntitiesSelector = (state) => ({
  savedEntities: state.savedEntities,
  deleteEntity: state.deleteEntity,
});

function SavedEntitiesTable() {
  const [selectedRows, addToSelectedRows, removeFromSelectedRows, setSelectedRows] = useStateSet([]);
  const [headerRowIsSelected, setHeaderRowIsSelected] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [addToDialogIsOpen, setAddToDialogIsOpen] = useState(false);

  const { savedEntities, deleteEntity } = useSavedEntitiesStore(useSavedEntitiesSelector);

  function selectAllRows() {
    setSelectedRows(new Set(Object.keys(savedEntities)));
    setHeaderRowIsSelected(true);
  }

  function deselectAllRows() {
    setSelectedRows(new Set([]));
    setHeaderRowIsSelected(false);
  }

  function deleteSelectedSavedEntities() {
    selectedRows.forEach((uuid) => deleteEntity(uuid));
    deselectAllRows();
  }

  const selectedRowsSize = selectedRows.size;

  return (
    <>
      <Flex>
        <Typography variant="subtitle1">
          {selectedRowsSize} {selectedRowsSize === 1 ? 'Item' : 'Items'} Selected
        </Typography>
        <div>
          <Button color="primary" onClick={() => deselectAllRows()}>
            Deselect All ({selectedRowsSize})
          </Button>
          <SecondaryBackgroundTooltip title="Delete Items">
            <WhiteBackgroundIconButton onClick={() => setDeleteDialogIsOpen(true)}>
              <DeleteRoundedIcon color="primary" />
            </WhiteBackgroundIconButton>
          </SecondaryBackgroundTooltip>
          <DeleteSavedEntitiesDialog
            dialogIsOpen={deleteDialogIsOpen}
            setDialogIsOpen={setDeleteDialogIsOpen}
            deleteSelectedSavedEntities={deleteSelectedSavedEntities}
          />
          <Button color="primary" onClick={() => setAddToDialogIsOpen(true)} variant="contained">
            Add To
          </Button>
          <SaveToListDialog
            title="Add Items To"
            dialogIsOpen={addToDialogIsOpen}
            setDialogIsOpen={setAddToDialogIsOpen}
            entitiesToAdd={selectedRows}
          />
        </div>
      </Flex>
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow onClick={() => selectAllRows()}>
                <HeaderCell padding="checkbox">
                  <Checkbox
                    checked={headerRowIsSelected}
                    inputProps={{ 'aria-labelledby': `saved-entities-header-row-checkbox` }}
                  />
                </HeaderCell>
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.label}</HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(savedEntities).map(([key, value], i) => (
                <SavedEntitiesTableRow
                  key={key}
                  uuid={key}
                  dateSaved={value.dateSaved}
                  index={i}
                  isSelected={selectedRows.has(key)}
                  addToSelectedRows={addToSelectedRows}
                  removeFromSelectedRows={removeFromSelectedRows}
                />
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </>
  );
}

export default SavedEntitiesTable;
