import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import { StyledTableContainer, HeaderCell } from 'shared-styles/Table';
import { HeaderIconCell, StyledLink, StyledInfoIcon } from './style';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';

const useTooltipStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '0.4rem',
  },
}));

function CollectionCreatorsTable(props) {
  const { creators: tableRows } = props;

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'affiliation', label: 'Affiliation' },
  ];

  const classes = useTooltipStyles();

  return (
    <SectionContainer id="datasets-table">
      <SectionHeader variant="h3" component="h2">
        Creators
      </SectionHeader>
      <Paper>
        <StyledTableContainer $maxHeight={312}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.label}</HeaderCell>
                ))}
                <HeaderIconCell>
                  ORCID ID
                  <Tooltip title="Open Researcher and Contributor ID" classes={classes}>
                    <StyledInfoIcon color="primary" />
                  </Tooltip>
                </HeaderIconCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow key={row.orcid_id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.affiliation}</TableCell>
                  <TableCell>
                    <StyledLink
                      href={`https://orcid.org/${row.orcid_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                    >
                      {row.orcid_id}
                    </StyledLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </SectionContainer>
  );
}

CollectionCreatorsTable.propTypes = {
  creators: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CollectionCreatorsTable;
