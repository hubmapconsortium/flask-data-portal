import React, { useContext, useEffect, useState } from 'react';

import { AppContext } from 'js/components/Providers';
import useImmediateDescendantProv from 'js/hooks/useImmediateDescendantProv';
import useProvenanceStore from 'js/stores/useProvenanceStore';
import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import ProvData from '../ProvVis/ProvData';

function getUniqueNewSteps(steps, newSteps) {
  const nameSet = new Set(steps.map((step) => step.name));
  return newSteps.filter((step) => !nameSet.has(step.name));
}

const useProvenanceStoreSelector = (state) => ({ steps: state.steps, addDescendantSteps: state.addDescendantSteps });

function ShowDerivedEntitiesButton({ id, getNameForActivity, getNameForEntity }) {
  const { elasticsearchEndpoint, entityEndpoint, nexusToken } = useContext(AppContext);
  const { steps, addDescendantSteps } = useProvenanceStore(useProvenanceStoreSelector);
  const [newSteps, setNewSteps] = useState([]);

  const { immediateDescendantsProvData } = useImmediateDescendantProv(
    id,
    elasticsearchEndpoint,
    entityEndpoint,
    nexusToken,
  );

  useEffect(() => {
    if (immediateDescendantsProvData) {
      const immediateDescendantSteps = immediateDescendantsProvData
        .map((result) => new ProvData(result, getNameForActivity, getNameForEntity).toCwl())
        .flat();
      setNewSteps(getUniqueNewSteps(steps, immediateDescendantSteps));
    }
  }, [immediateDescendantsProvData, steps, getNameForActivity, getNameForEntity]);
  function handleShowDescendants() {
    addDescendantSteps(newSteps);
  }
  return (
    <OptDisabledButton
      color="primary"
      variant="contained"
      onClick={handleShowDescendants}
      disabled={newSteps.length === 0}
    >
      Show Derived Entities
    </OptDisabledButton>
  );
}

export { getUniqueNewSteps };
export default ShowDerivedEntitiesButton;
