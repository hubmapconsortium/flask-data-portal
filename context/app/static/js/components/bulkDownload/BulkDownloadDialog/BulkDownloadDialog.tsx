import React from 'react';
import { Control } from 'react-hook-form';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { LINKS, PAGES } from 'js/components/bulkDownload/constants';
import { BulkDownloadFormTypes, useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import RemoveProtectedDatasetsFormField from 'js/components/workspaces/RemoveProtectedDatasetsFormField';
import BulkDownloadOptionsField from 'js/components/bulkDownload/BulkDownloadOptionsField';
import BulkDownloadMetadataField from 'js/components/bulkDownload/BulkDownloadMetadataField';
import { DatasetAccessLevelHits } from 'js/hooks/useProtectedDatasets';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import DialogModal from 'js/shared-styles/DialogModal';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import Step from 'js/shared-styles/surfaces/Step';
import { OutboundLink } from 'js/shared-styles/Links';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { Alert } from 'js/shared-styles/alerts';
import ErrorOrWarningMessages from 'js/shared-styles/alerts/ErrorOrWarningMessages';

function DownloadDescription() {
  return (
    <SectionDescription>
      <Stack spacing={2}>
        <Box>
          Choose download options to bulk download files from your selected datasets. Your selection of files will
          generate a manifest file, which can be used with the{' '}
          <OutboundLink href={LINKS.documentation}>HuBMAP Command Line Transfer (CLT)</OutboundLink> tool for
          downloading. An option to download a tsv file of the metadata is also available.
        </Box>
        <Box>
          To download the files included in the manifest file,{' '}
          <OutboundLink href={LINKS.installation}>install the HuBMAP CLT</OutboundLink> (if not already installed) and
          follow <OutboundLink href={LINKS.documentation}>instructions</OutboundLink> for how to use it with the
          manifest file.
          {/* TODO: uncomment once tutorial is created */}
          {/* A <OutboundLink href={LINKS.tutorial}>tutorial</OutboundLink> is available to guide you through
          the entire process. */}
        </Box>
        <RelevantPagesSection pages={PAGES} />
      </Stack>
    </SectionDescription>
  );
}

interface ProtectedDatasetsSectionProps {
  control: Control<BulkDownloadFormTypes>;
  errorMessages: string[];
  protectedHubmapIds: string;
  protectedRows: DatasetAccessLevelHits;
  removeProtectedDatasets: () => void;
}
function ProtectedDatasetsSection({
  control,
  errorMessages,
  protectedHubmapIds,
  protectedRows,
  removeProtectedDatasets,
}: ProtectedDatasetsSectionProps) {
  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <Stack paddingY={1}>
      <ErrorOrWarningMessages errorMessages={errorMessages} />
      <RemoveProtectedDatasetsFormField
        control={control}
        protectedHubmapIds={protectedHubmapIds}
        removeProtectedDatasets={removeProtectedDatasets}
        protectedRows={protectedRows}
      />
    </Stack>
  );
}

function DownloadOptionsDescription() {
  return (
    <SectionDescription>
      <Stack spacing={2}>
        <Box>Select raw and/or processed files to download.</Box>
        <LabelledSectionText label="Raw Data" spacing={1}>
          Raw data consists of files as originally submitted by the data submitters. Individuals files for raw data
          cannot be previewed or selected for the manifest download. You must download all raw files, and the total
          download size cannot be estimated.
        </LabelledSectionText>
        <LabelledSectionText label="Processed Data" spacing={1}>
          Processed data includes files associated with data generated by HuBMAP using uniform processing pipelines or
          by an external processing approach. Only files centrally processed by HuBMAP are available for individual
          selection, which can be done in the Advanced Selections section below.
        </LabelledSectionText>
      </Stack>
    </SectionDescription>
  );
}

interface DownloadOptionsSectionProps {
  control: Control<BulkDownloadFormTypes>;
  downloadOptions: {
    key: string;
    label: string;
  }[];
  isLoading: boolean;
  errorMessages: string[];
  protectedHubmapIds: string;
  protectedRows: DatasetAccessLevelHits;
  removeProtectedDatasets: () => void;
}
function DownloadOptionsSection({
  control,
  downloadOptions,
  isLoading,
  errorMessages,
  protectedHubmapIds,
  protectedRows,
  removeProtectedDatasets,
}: DownloadOptionsSectionProps) {
  if (isLoading) {
    return (
      <>
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={300} />
        <Skeleton variant="rectangular" height={200} />
      </>
    );
  }

  if (downloadOptions.length === 0) {
    return (
      <Box paddingTop={1}>
        <Alert severity="warning">
          <Typography>Files are not available for any of the selected datasets.</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Step title="Download Options" hideRequiredText>
        <ProtectedDatasetsSection
          control={control}
          errorMessages={errorMessages}
          protectedHubmapIds={protectedHubmapIds}
          protectedRows={protectedRows}
          removeProtectedDatasets={removeProtectedDatasets}
        />
        <DownloadOptionsDescription />
        <SummaryPaper>
          <Stack direction="column" spacing={2}>
            <BulkDownloadOptionsField control={control} name="bulkDownloadOptions" />
            <BulkDownloadMetadataField control={control} name="bulkDownloadMetadata" />
          </Stack>
        </SummaryPaper>
      </Step>
    </Box>
  );
}

const formId = 'bulk-download-form';

interface BulkDownloadDialogProps {
  deselectRows?: (uuids: string[]) => void;
}
function BulkDownloadDialog({ deselectRows }: BulkDownloadDialogProps) {
  const {
    handleSubmit,
    onSubmit,
    handleClose,
    isOpen,
    errors,
    control,
    isLoading,
    downloadOptions,
    errorMessages,
    ...rest
  } = useBulkDownloadDialog({ deselectRows });

  return (
    <DialogModal
      title="Bulk Download Files"
      maxWidth="lg"
      content={
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <DownloadDescription />
            <DownloadOptionsSection
              control={control}
              downloadOptions={downloadOptions}
              isLoading={isLoading}
              errorMessages={errorMessages}
              {...rest}
            />
          </Stack>
        </form>
      }
      isOpen={isOpen}
      handleClose={handleClose}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            form={formId}
            disabled={Object.keys(errors).length > 0 || errorMessages.length > 0}
          >
            Generate Download Manifest
          </Button>
        </Stack>
      }
      withCloseButton
    />
  );
}

export default BulkDownloadDialog;
