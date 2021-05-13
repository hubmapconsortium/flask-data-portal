import React from 'react';
import Button from '@material-ui/core/Button';

import DisabledButton from 'js/shared-styles/buttons/DisabledButton';
import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import CreateListDialog from 'js/components/savedLists/CreateListDialog';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';

const useSavedEntitiesSelector = (state) => ({
  addEntitiesToList: state.addEntitiesToList,
  savedLists: state.savedLists,
});

function SaveToListDialog({ title, dialogIsOpen, setDialogIsOpen, entitiesToAdd, onSaveCallback }) {
  const [selectedLists, addToSelectedLists, removeFromSelectedLists] = useStateSet([]);

  const { addEntitiesToList, savedLists } = useSavedEntitiesStore(useSavedEntitiesSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((list) => addEntitiesToList(list, entitiesToAdd));
  }

  function handleSubmit() {
    addSavedEntitiesToList();
    setDialogIsOpen(false);
    onSaveCallback();
  }

  return Object.keys(savedLists).length ? (
    <DialogModal
      title={title}
      content={
        <AddToList
          selectedLists={selectedLists}
          addToSelectedLists={addToSelectedLists}
          removeFromSelectedLists={removeFromSelectedLists}
        />
      }
      actions={
        <>
          <Button onClick={() => setDialogIsOpen(false)} color="primary">
            Cancel
          </Button>
          <DisabledButton onClick={handleSubmit} color="primary" disabled={selectedLists.size === 0}>
            Save
          </DisabledButton>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => setDialogIsOpen(false)}
    />
  ) : (
    <CreateListDialog
      secondaryText="No lists created. Create a list before adding items."
      dialogIsOpen={dialogIsOpen}
      setDialogIsOpen={setDialogIsOpen}
    />
  );
}

export default SaveToListDialog;
