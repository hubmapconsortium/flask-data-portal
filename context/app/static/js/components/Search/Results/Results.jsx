import React from 'react';
import PropTypes from 'prop-types';
import { ViewSwitcherHits } from 'searchkit'; // eslint-disable-line import/no-duplicates

import ResultsTable from '../ResultsTable';
import ResultsTiles from '../ResultsTiles';

function Results(props) {
  const { sortOptions, hitsPerPage, tableResultFields, detailsUrlPrefix, idField, resultFieldIds, type } = props;
  // one of the sort components must stay mounted to preserve sort history between views.
  return (
    <ViewSwitcherHits
      hitsPerPage={hitsPerPage}
      hitComponents={[
        {
          key: 'table',
          title: 'Table',
          listComponent: (
            <ResultsTable
              resultFields={tableResultFields}
              detailsUrlPrefix={detailsUrlPrefix}
              idField={idField}
              sortOptions={sortOptions}
            />
          ),
          defaultOption: true,
        },
        { key: 'tile', title: 'Tile', listComponent: <ResultsTiles type={type} /> },
      ]}
      sourceFilter={resultFieldIds}
      customHighlight={{
        fields: { everything: { type: 'plain' } },
      }}
    />
  );
}

Results.propTypes = {
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  hitsPerPage: PropTypes.number.isRequired,
  tableResultFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  resultFieldIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string.isRequired,
};

export default Results;
