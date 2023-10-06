import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip, { ChipProps } from '@mui/material/Chip';
import Button from '@mui/material/Button';

import Step from 'shared-styles/surfaces/Step';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { useSelectItems } from 'js/hooks/useSelectItems';
import MultiAutocomplete from 'js/shared-styles/inputs/MultiAutocomplete';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import TemplateGrid from '../TemplateGrid';
import { useWorkspaceTemplates, useWorkspaceTemplateTags, useTemplateNotebooks } from './hooks';
import { useCreateWorkspace } from './copiedHooks';
import useProtectedDatasetsForm from './useProtectedDatasetsForm';

interface ProtectedDatasetsTypes {
  errorMessages: string[];
  protectedHubmapIds: string[];
  removeProtectedDatasets: () => void;
  protectedRows: string[];
  selectedRows: Set<string>;
}
interface TagTypes extends ChipProps {
  option: string;
}

function TagComponent({ option, ...rest }: TagTypes) {
  return <Chip label={option} {...rest} />;
}

const recommendedTags = ['visualization', 'api'];

function NewWorkspaceDialog() {
  const { selectedItems: selectedRecommendedTags, toggleItem: toggleTag } = useSelectItems([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const { templates } = useWorkspaceTemplates([...selectedTags, ...selectedRecommendedTags]);

  const { selectedItems: selectedTemplates, toggleItem: toggleTemplate } = useSelectItems([]);

  const { tags } = useWorkspaceTemplateTags();

  const createTemplateNotebooks = useTemplateNotebooks();

  const { dialogIsOpen, setDialogIsOpen, handleSubmit, handleClose, control, errors, onSubmit } = useCreateWorkspace({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handleCreateWorkspace: createTemplateNotebooks,
    defaultName: '',
  });

  const { errorMessages, protectedHubmapIds, removeProtectedDatasets, protectedRows, selectedRows } =
    useProtectedDatasetsForm() as ProtectedDatasetsTypes;

  return (
    <>
      <Button
        onClick={() => {
          setDialogIsOpen(true);
        }}
      >
        OPEN ME
      </Button>
      ;
      <Dialog
        open={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
      >
        <Box mb={2}>
          <DialogTitle id="scroll-dialog-title" variant="h3">
            Launch New Workspace
          </DialogTitle>
          <Box sx={{ px: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Typography sx={{ mb: 2 }}>
                Workspaces are currently Jupyter Notebooks that allows you to perform operations on HuBMAP data.
              </Typography>
              <Typography>
                Three steps are shown for launching a workspace, but the only required field to launch a workspace is
                “Step 2: Configure Workspace”. “Step 1: Edit Datasets Selection” is only required if there are issues
                with any of the datasets selected, which will be indicated by an error banner.
              </Typography>
            </Paper>
          </Box>
        </Box>
        <DialogContent dividers>
          <Step title="Edit Datasets Selection" index={0}>
            {protectedHubmapIds.length > 0 && (
              <Box>
                <ErrorMessages errorMessages={errorMessages} />
                <WorkspaceField
                  control={control}
                  name="Protected Datasets"
                  errors={errors}
                  value={protectedHubmapIds}
                  error
                />
                <Button sx={{ marginTop: 1 }} variant="contained" color="primary" onClick={removeProtectedDatasets}>
                  Remove Protected Datasets ({protectedRows.length})
                </Button>
              </Box>
            )}
            <Paper sx={{ p: 2 }}>
              <Typography sx={{ mb: 2 }}>
                To remove a dataset, select the dataset and press the delete button. If all datasets are removed, an
                empty workspace will be launched.
              </Typography>
              <Typography>
                To add more datasets to a workspace, you must navigate to the dataset search page, select datasets of
                interests and follow steps to launch a workspace from the search page. As a reminder, once you navigate
                away from this page, all selected datasets will be lost so take note of any HuBMAP IDs of interest, or
                copy IDs to your clipboard by selecting datasets in the table below and pressing the copy button. You
                can also save datasets to the “My Lists” feature.
              </Typography>
            </Paper>
          </Step>
          <Step title="Configure Workspace" isRequired index={1}>
            <Box
              id="create-workspace-form"
              component="form"
              sx={{
                display: 'grid',
                gap: 2,
                marginTop: 1,
              }}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmit((formData) =>
                onSubmit(formData, { templateKeys: [...selectedTemplates], uuids: [...selectedRows] }),
              )}
            >
              <WorkspaceField
                control={control}
                name="workspace-name"
                label="Name"
                placeholder="Like “Spleen-Related Data” or “ATAC-seq Visualizations”"
                errors={errors}
                autoFocus
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                }}
              />
            </Box>
          </Step>
          <Step title="Select Templates" index={2}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography sx={{ mb: 2 }}>
                Templates can be selected for your workspace for potential workflows revolving around data assays,
                visualization, QA or other purposes. Multiple templates can be selected. If you are unsure of which
                templates to launch, the “Select All” button selects all templates.
              </Typography>
              <Typography>
                If you have ideas about additional templates to include in the future, please <ContactUsLink /> .
              </Typography>
            </Paper>
            <Typography variant="subtitle1">Filter workspace templates by tags</Typography>
            <Stack spacing={1}>
              <MultiAutocomplete
                value={selectedTags}
                options={Object.keys(tags)
                  .filter((tag) => !recommendedTags.includes(tag))
                  .sort((a, b) => a.localeCompare(b))}
                multiple
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option === value}
                tagComponent={TagComponent}
                onChange={(_, value: string[]) => {
                  setSelectedTags(value);
                }}
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Recommended Tags
                </Typography>
                <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                  {recommendedTags.map((tag) => (
                    <SelectableChip
                      isSelected={selectedRecommendedTags.has(tag)}
                      label={tag}
                      onClick={() => toggleTag(tag)}
                      key={tag}
                    />
                  ))}
                </Stack>
              </Box>
              <TemplateGrid
                templates={templates}
                selectedTemplates={selectedTemplates}
                toggleTemplate={toggleTemplate}
              />
            </Stack>
          </Step>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            form="create-workspace-form"
            disabled={Object.keys(errors).length > 0 || errorMessages.length > 0}
          >
            Launch
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default NewWorkspaceDialog;