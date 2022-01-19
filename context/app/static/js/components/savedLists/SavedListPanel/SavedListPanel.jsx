import React from 'react';
import { Panel } from 'js/shared-styles/panels';

import { useSavedEntityTypeCounts } from './hooks';

function SavedListPanel({ entityObject, listUUID }) {
  const { savedEntities, description, title } = entityObject;
  const counts = useSavedEntityTypeCounts(savedEntities);
  return <Panel title={title} href={`/my-lists/${listUUID}`} secondaryText={description} entityCounts={counts} />;
}

export default SavedListPanel;
