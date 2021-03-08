import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

import { AppContext } from 'js/components/Providers';
import useImmediateDescendantProv from 'js/hooks/useImmediateDescendantProv';
import useProvenanceStore from 'js/stores/useProvenanceStore';
import ProvData from '../ProvVis/ProvData';

function createStepNameSet(steps) {
  return new Set(steps.map((step) => step.name));
}

function removeExistingSteps(steps, newSteps) {
  const nameSet = createStepNameSet(steps);
  const uniqueNewSteps = newSteps.filter((step) => !nameSet.has(step.name));
  return uniqueNewSteps;
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
      setNewSteps(removeExistingSteps(steps, immediateDescendantSteps));
    }
  }, [immediateDescendantsProvData, steps, getNameForActivity, getNameForEntity]);
  function handleShowDescendants() {
    addDescendantSteps(newSteps);
  }
  return (
    <Button color="primary" variant="contained" onClick={handleShowDescendants} disabled={newSteps.length === 0}>
      Show Derived Entities
    </Button>
  );
}

export default ShowDerivedEntitiesButton;
