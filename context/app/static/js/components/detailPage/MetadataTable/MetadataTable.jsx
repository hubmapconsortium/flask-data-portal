import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useFlaskDataContext } from 'js/components/Contexts';
import metadataFieldDescriptions from 'metadata-field-descriptions';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { tableToDelimitedString, createDownloadUrl } from 'js/helpers/functions';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';
import { DetailPageSection } from 'js/components/detailPage/style';
import { DownloadIcon, Flex, StyledWhiteBackgroundIconButton } from './style';

function getDescription(field) {
  const [prefix, stem] = field.split('.');
  if (!stem) {
    return metadataFieldDescriptions[field];
  }
  const description = metadataFieldDescriptions[stem];
  if (!description) {
    return undefined;
  }
  if (prefix === 'donor') {
    return `For the original donor: ${metadataFieldDescriptions[stem]}`;
  }
  if (prefix === 'sample') {
    return `For the original sample: ${metadataFieldDescriptions[stem]}`;
  }
  throw new Error(`Unrecognized metadata field prefix: ${prefix}`);
}

function tableDataToRows(tableData) {
  return (
    Object.entries(tableData)
      // Filter out nested objects, like nested "metadata" for Samples...
      // but allow arrays. Remember, in JS: typeof [] === 'object'
      .filter((entry) => typeof entry[1] !== 'object' || Array.isArray(entry[1]))
      // Filter out fields from TSV that aren't really metadata:
      .filter((entry) => !['contributors_path', 'antibodies_path', 'version'].includes(entry[0]))
      .map((entry) => ({
        key: entry[0],
        value: Array.isArray(entry[1]) ? entry[1].join(', ') : entry[1].toString(),
        description: getDescription(entry[0]),
      }))
  );
}

function MetadataTable({ metadata: tableData = {}, hubmap_id }) {
  const {
    entity: { entity_type },
  } = useFlaskDataContext();

  const columns = [
    { id: 'key', label: 'Key' },
    { id: 'value', label: 'Value' },
  ];

  const tableRows = tableDataToRows(tableData);

  const downloadUrl = createDownloadUrl(
    tableToDelimitedString(
      tableRows,
      columns.map((col) => col.label),
      '\t',
    ),
    'text/tab-separated-values',
  );

  return (
    <DetailPageSection id="metadata">
      <Flex>
        <SectionHeader iconTooltipText={`Data provided for the given ${entity_type?.toLowerCase()}.`}>
          Metadata
        </SectionHeader>
        <SecondaryBackgroundTooltip title="Download">
          <StyledWhiteBackgroundIconButton href={downloadUrl} download={`${hubmap_id}.tsv`}>
            <DownloadIcon color="primary" />
          </StyledWhiteBackgroundIconButton>
        </SecondaryBackgroundTooltip>
      </Flex>
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.label}</HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.key}>
                  <IconTooltipCell tooltipTitle={row?.description}>{row.key}</IconTooltipCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </DetailPageSection>
  );
}

export default MetadataTable;
export { tableDataToRows, getDescription };
