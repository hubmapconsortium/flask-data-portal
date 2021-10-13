import React, { useState, useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import Histogram from 'js/shared-styles/charts/Histogram';
import CellsService from 'js/components/cells/CellsService';
import ChartLoader from 'js/components/cells/ChartLoader';

function CellExpressionHistogram({ uuid, cellVariableName, isLoading, finishLoading, loadingKey, isExpanded }) {
  const [expressionData, setExpressionData] = useState([]);
  const [diagnosticInfo, setDiagnosticInfo] = useState({});
  const theme = useTheme();
  const loadedOnce = useRef(false);

  useEffect(() => {
    async function fetchCellExpression() {
      const t0 = performance.now();

      const response = await new CellsService().getCellExpressionInDataset({
        uuid,
        cellVariableNames: [cellVariableName],
      });
      const t1 = performance.now();
      const timeWaiting = (t1 - t0) / 1000;
      const numCells = response.length;
      setDiagnosticInfo({ numCells, timeWaiting });
      setExpressionData(response.map((d) => d.values[cellVariableName]));
      finishLoading(loadingKey);
    }
    if (loadedOnce.current) {
      return;
    }

    if (isExpanded) {
      fetchCellExpression();
      loadedOnce.current = true;
    }
  }, [uuid, cellVariableName, finishLoading, loadingKey, isExpanded]);

  if (Object.values(isLoading).some((val) => val)) {
    return <ChartLoader />;
  }

  return (
    <>
      <Typography>
        {diagnosticInfo.timeWaiting.toFixed(2)} seconds to receive an API response for {diagnosticInfo.numCells} cells.
      </Typography>
      <Histogram
        visxData={expressionData}
        margin={{
          top: 50,
          right: 50,
          left: 65,
          bottom: 65,
        }}
        barColor={theme.palette.success.main}
        xAxisLabel="Expression Level"
        yAxisLabel="Frequency"
      />
    </>
  );
}

export default CellExpressionHistogram;
