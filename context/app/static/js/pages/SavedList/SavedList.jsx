import React from 'react';
import Typography from '@material-ui/core/Typography';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import DetailDescription from 'js/components/Detail/DetailDescription';
import SavedListMenuButton from 'js/components/savedLists/SavedListMenuButton';
import EditListButton from 'js/components/savedLists/EditListButton';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { LightBlueLink } from 'js/shared-styles/Links';
import Description from 'js/shared-styles/sections/Description';
import { StyledButtonRow, BottomAlignedTypography, SpacingDiv, PageSpacing, StyledHeader } from './style';

const usedSavedEntitiesSelector = (state) => ({
  savedLists: state.savedLists,
  removeEntitiesFromList: state.removeEntitiesFromList,
});

function SavedList({ listUUID }) {
  const { savedLists, removeEntitiesFromList } = useSavedEntitiesStore(usedSavedEntitiesSelector);
  const savedList = savedLists[listUUID];

  const { savedEntities: listEntities } = savedList;

  const entitiesLength = Object.keys(listEntities).length;

  const { title, description } = savedList;

  function deleteCallback(uuids) {
    removeEntitiesFromList(listUUID, uuids);
  }

  return (
    <PageSpacing>
      <Typography variant="subtitle1" component="h1" color="primary">
        List
      </Typography>
      <Typography variant="h2">{title}</Typography>
      <StyledButtonRow
        leftText={
          <BottomAlignedTypography variant="body1" color="primary">
            {entitiesLength} {entitiesLength === 1 ? 'Item' : 'Items'}
          </BottomAlignedTypography>
        }
        buttons={
          <>
            <EditListButton listDescription={description} listTitle={title} listUUID={listUUID} />
            <SavedListMenuButton listUUID={listUUID} />
          </>
        }
      />
      <SpacingDiv>
        <LocalStorageDescription />
      </SpacingDiv>
      <SpacingDiv>
        <DetailDescription
          description={savedList.description}
          createdTimestamp={savedList.dateSaved}
          modifiedTimestamp={savedList.dateLastModified}
        />
      </SpacingDiv>
      <StyledHeader variant="h3" component="h2">
        Items
      </StyledHeader>
      {Object.keys(listEntities).length === 0 ? (
        <Description padding="20px 20px">
          No items saved. Navigate to <LightBlueLink href="/search?entity_type[0]=Donor">donors</LightBlueLink>,{' '}
          <LightBlueLink href="/search?entity_type[0]=Sample">samples</LightBlueLink> or{' '}
          <LightBlueLink href="/search?entity_type[0]=Dataset">datasets</LightBlueLink> search pages to explore data to
          save or navigate to <LightBlueLink href="/my-lists">My Lists</LightBlueLink> to add items to this list.
        </Description>
      ) : (
        <SavedEntitiesTable savedEntities={listEntities} deleteCallback={deleteCallback} isSavedListPage />
      )}
    </PageSpacing>
  );
}

export default SavedList;
