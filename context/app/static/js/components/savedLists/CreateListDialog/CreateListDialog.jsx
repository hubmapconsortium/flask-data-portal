import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import DisabledButton from 'shared-styles/buttons/DisabledButton';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import DialogModal from 'js/shared-styles/DialogModal';
import { StyledTitleTextField, StyledDescriptionTextField } from './style';

const useSavedEntitiesStoreSelector = (state) => state.createList;

function CreateListDialog({ secondaryText, dialogIsOpen, setDialogIsOpen }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createList = useSavedEntitiesStore(useSavedEntitiesStoreSelector);

  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  const handleClose = () => {
    setDialogIsOpen(false);
  };

  function handleExit() {
    setTitle('');
    setDescription('');
  }

  function handleSubmit() {
    createList({ title, description });
    setDialogIsOpen(false);
  }

  return (
    <DialogModal
      title="Create New List"
      secondaryText={secondaryText}
      content={
        <>
          <StyledTitleTextField handleChange={handleTitleChange} title={title} />
          <StyledDescriptionTextField handleChange={handleDescriptionChange} description={description} />
        </>
      }
      actions={
        <>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <DisabledButton onClick={handleSubmit} color="primary" disabled={title.length === 0}>
            Save
          </DisabledButton>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={handleClose}
      onExited={handleExit}
    />
  );
}

export default CreateListDialog;
