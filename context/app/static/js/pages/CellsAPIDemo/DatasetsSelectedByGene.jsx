import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';

import ResultsTable from './ResultsTable';
import CellsService from './CellsService';

// eslint-disable-next-line no-unused-vars
function DatasetsSelectedByGene(props) {
  const [geneName, setGeneName] = useState('VIM');
  const [minGeneExpression, setMinGeneExpression] = useState(1);
  const [minCellPercentage, setMinCellPercentage] = useState(10);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);

  async function handleSubmit() {
    try {
      const serviceResults = await new CellsService().getDatasetsSelectedByGene({
        geneName,
        minGeneExpression,
        minCellPercentage,
      });
      setResults(serviceResults);
    } catch (e) {
      setMessage(e.message);
    }
  }

  function handleChange(event) {
    const { target } = event;
    const { name } = target;
    const setFields = {
      geneName: setGeneName,
    };
    setFields[name](event.target.value);
  }

  return (
    <Paper>
      <TextField label="gene name" value={geneName} name="geneName" variant="outlined" onChange={handleChange} />

      <br />

      <FormLabel id="min-gene-expression-label">Minimum gene expression</FormLabel>
      <SliderWrapper
        value={minGeneExpression}
        min={0}
        max={100}
        setter={setMinGeneExpression}
        labelledby="min-gene-expression-label"
      />

      <FormLabel id="min-cell-percentage-label">Minimum cell percentage</FormLabel>
      <SliderWrapper
        value={minCellPercentage}
        min={0}
        max={100}
        setter={setMinCellPercentage}
        labelledby="min-cell-percentage-label"
      />

      <br />
      <Button onClick={handleSubmit}>Submit</Button>
      <br />
      {message}
      <ResultsTable results={results} />
    </Paper>
  );
}

function SliderWrapper(props) {
  const { value, min, max, setter, labelledby } = props;
  return (
    <Slider
      value={value}
      min={min}
      max={max}
      valueLabelDisplay="auto"
      marks={[
        { value: min, label: min },
        { value: max, label: max },
      ]}
      onChange={(e, val) => {
        setter(val);
      }}
      aria-labelledby={labelledby}
    />
  );
}

export default DatasetsSelectedByGene;
