import React from 'react';
import PropTypes from 'prop-types';
import { ViewSwitcherHits } from 'searchkit';

import ResultsTable from '../ResultsTable';
import ResultsCCF from '../ResultsCCF';

function DevResults(props) {
  const { sortOptions, hitsPerPage, tableResultFields, detailsUrlPrefix, idField, resultFieldIds } = props;

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
        { key: 'ccf', title: 'CCF', listComponent: <ResultsCCF /> },
      ]}
      sourceFilter={resultFieldIds}
      customHighlight={{
        fields: { everything: { type: 'plain' } },
      }}
    />
  );
}

/*
    <Hits
      hitsPerPage={hitsPerPage}
      listComponent={
        <ResultsTable
          resultFields={tableResultFields}
          detailsUrlPrefix={detailsUrlPrefix}
          idField={idField}
          sortOptions={sortOptions}
        />
      }
      sourceFilter={resultFieldIds}
      customHighlight={{
        fields: { everything: { type: 'plain' } },
      }}
    />
*/

DevResults.propTypes = {
  sortOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  hitsPerPage: PropTypes.number.isRequired,
  tableResultFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  detailsUrlPrefix: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  resultFieldIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DevResults;
