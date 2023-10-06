import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery, getTermClause } from 'js/helpers/queries';

const schema = yup
  .object({
    'workspace-name': yup.string().required().max(150),
  })
  .required();

function useCreateWorkspace({ handleCreateWorkspace, defaultName }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '' || defaultName,
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  function handleClose() {
    reset();
    setDialogIsOpen(false);
  }

  function onSubmit({ 'workspace-name': workspaceName }, { templateKeys, uuids }) {
    handleCreateWorkspace({ workspaceName, templateKeys, uuids });
    reset();
    handleClose();
  }

  return { dialogIsOpen, setDialogIsOpen, handleClose, handleSubmit, control, errors, onSubmit };
}

function useDatasetsAccessLevel(ids) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(ids), getTermClause('mapped_data_access_level.keyword', 'Protected')],
      },
    },
    _source: ['mapped_data_access_level', 'hubmap_id'],
    size: ids.length,
  };
  const { searchHits: datasets } = useSearchHits(query);
  return { datasets };
}

export { useCreateWorkspace, useDatasetsAccessLevel };