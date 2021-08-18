import React from 'react';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Publications(props) {
  const { publications } = props;

  return (
    <>
      <SectionContainer id="summary">
        <SectionHeader variant="h1" component="h1">
          Publications
        </SectionHeader>
        <Paper>
          <Table>
            <TableBody>
              {Object.entries(publications || []).map(([path, publication]) => (
                <TableRow key={path}>
                  <TableCell>
                    <Typography variant="subtitle2" component="h3" color="primary">
                      <LightBlueLink href={`/publication/${path}`}>{publication.title}</LightBlueLink>
                    </Typography>
                    {publication.authors}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </SectionContainer>
    </>
  );
}

export default Publications;
