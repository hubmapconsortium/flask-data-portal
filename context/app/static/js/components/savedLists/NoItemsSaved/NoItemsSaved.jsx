import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import Description from 'js/shared-styles/sections/Description';

function SearchPagesPrompt() {
  return (
    <>
      navigate to <LightBlueLink href="/search?entity_type[0]=Donor">donors</LightBlueLink>,{' '}
      <LightBlueLink href="/search?entity_type[0]=Sample">samples</LightBlueLink> or{' '}
      <LightBlueLink href="/search?entity_type[0]=Dataset">datasets</LightBlueLink> search pages
    </>
  );
}

function LoginPrompt() {
  return (
    <>
      <LightBlueLink href="/login">Login</LightBlueLink> to view additional saved items
    </>
  );
}

function SavedListMessage() {
  return (
    <>
      <LoginPrompt />. To explore data to add to this list, <SearchPagesPrompt />, or add items from{' '}
      <LightBlueLink href="/my-lists">My Lists</LightBlueLink>{' '}
    </>
  );
}

function SavedListsMessage() {
  return (
    <>
      <LoginPrompt /> or <SearchPagesPrompt /> to explore data to save
    </>
  );
}

function NoItemsSaved({ isSavedListPage }) {
  return (
    <Description padding="20px 20px">
      No items saved. {isSavedListPage ? <SavedListMessage /> : <SavedListsMessage />}.
    </Description>
  );
}

export default NoItemsSaved;
