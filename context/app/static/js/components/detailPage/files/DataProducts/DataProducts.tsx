import React, { Fragment } from 'react';
import prettyBytes from 'pretty-bytes';

import Paper from '@mui/material/Paper';
import { Box, Button, Divider, IconButton, Typography, TypographyProps } from '@mui/material';
import { useAppContext } from 'js/components/Contexts';
import { FileIcon } from 'js/shared-styles/icons';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import StyledDetails from 'js/shared-styles/accordions/StyledDetails/StyledDetails';
import { UnprocessedFile } from '../types';
import { DownloadIcon } from '../../MetadataTable/style';
import { useDetailContext } from '../../DetailContext';
import FilesConditionalLink from '../../BulkDataTransfer/FilesConditionalLink';
import { FilesContextProvider, useFilesContext } from '../FilesContext';
import { usePipelineInfo } from './hooks';

type DataProductsProps = {
  files: UnprocessedFile[];
};

function FileSize({ size, variant = 'body2' }: { size: number; variant?: TypographyProps['variant'] }) {
  return (
    <Typography component="p" variant={variant} color="#00000099">
      {prettyBytes(size)}
    </Typography>
  );
}

function useFileLink(file: UnprocessedFile) {
  const { assetsEndpoint } = useAppContext();
  const { uuid } = useDetailContext();
  return `${assetsEndpoint}/${uuid}/${file.rel_path}`;
}

function DownloadFileButton({ file }: { file: UnprocessedFile }) {
  const link = useFileLink(file);

  return (
    <IconButton size="small" color="primary" aria-label={`Download ${file.rel_path}`} download href={link}>
      <DownloadIcon />
    </IconButton>
  );
}

function PipelineInfo() {
  const { origin, name } = usePipelineInfo();
  return (
    <OutboundLink onClick={undefined} href={origin}>
      {name}
    </OutboundLink>
  );
}

function DataProduct({ file }: { file: UnprocessedFile }) {
  const link = useFileLink(file);
  const { openDUA, hasAgreedToDUA } = useFilesContext();
  return (
    <Box key={file.rel_path} data-testid="data-product" sx={{ mt: 2, mb: 1 }}>
      <Box display="flex">
        <Box pl={4} pr={2}>
          <FileIcon
            sx={(theme) => ({
              color: theme.palette.primary.main,
            })}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - TODO: HMP-349 will let us set font sizes via `sx` or `fontSize` prop
            $fontSize="2.5rem"
          />
        </Box>
        <Box width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <div>
              <FilesConditionalLink
                openDUA={openDUA}
                hasAgreedToDUA={hasAgreedToDUA}
                href={link}
                underline="none"
                download
              >
                {file.rel_path}
              </FilesConditionalLink>
              <FileSize size={file.size} />
            </div>
            <DownloadFileButton file={file} />
          </Box>
          <Typography variant="body2">
            {file.description} (Format: {file.edam_term})
          </Typography>
          <StyledDetails summary="Additional Details">
            <Typography variant="subtitle2">Description</Typography>
            <Typography variant="body2">
              {file.mapped_description} (Format: {file.edam_term})
            </Typography>
            <Typography variant="subtitle2">Data Generation</Typography>
            <Typography variant="body2">
              Data was generated by <PipelineInfo />
            </Typography>
          </StyledDetails>
        </Box>
      </Box>
    </Box>
  );
}

export function DataProducts({ files }: DataProductsProps) {
  const dataProducts = files.filter((file) => file.is_data_product);

  if (dataProducts.length === 0) {
    return null;
  }

  const totalFileSize = dataProducts.reduce((acc, file) => acc + file.size, 0);

  return (
    <FilesContextProvider>
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography component="h3" variant="h4" sx={{ mt: 0.25 }}>
              Data Products
            </Typography>
            <FileSize size={totalFileSize} variant="body2" />
          </Box>
          <Button variant="contained" color="primary" endIcon={<DownloadIcon />} sx={{ borderRadius: '4px' }}>
            Download All
          </Button>
        </Box>
        <Typography component="p" variant="body1" sx={{ my: 1 }}>
          Data products are essential files of this dataset for performing independent review of dataset contents. They
          include information about gene expression levels, RNA velocity, and other products of analysis.
        </Typography>
        <Box>
          {dataProducts.map((file, idx) => (
            <Fragment key={file.rel_path}>
              <DataProduct file={file} />
              {idx < dataProducts.length - 1 && <Divider />}
            </Fragment>
          ))}
        </Box>
      </Paper>
    </FilesContextProvider>
  );
}