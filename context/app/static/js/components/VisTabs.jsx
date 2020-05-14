import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { Vitessce } from 'vitessce';
import ProvGraph from './ProvGraph';
import ProvTable from './ProvTable';
import { useStyles } from '../styles';
import 'vitessce/build-lib/es/production/static/css/index.css';

function TabPanel(props) {
  const {
    children, value, index, className, boxClasses,
  } = props;
  return (
    <Typography
      className={className}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && <Box className={boxClasses} p={3}>{children}</Box>}
    </Typography>
  );
}


function VisTabs(props) {
  const { provData, assayMetadata, vitData } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(0);

  const handleChange = (event, newValue) => {
    setOpen(newValue);
  };
  return (
    <div className={classes.tabsRoot}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={open}
        onChange={handleChange}
        aria-label="Detail View Tabs"
        className={classes.tabs}
        indicatorColor="secondary"
      >
        <Tab
          label="Vitessce"
          id="vertical-tab-0"
          aria-controls="vertical-tabpanel-0"
        />
        <Tab
          label="Table"
          id="vertical-tab-1"
          aria-controls="vertical-tabpanel-1"
        />
        <Tab
          label="Graph"
          id="vertical-tab-2"
          aria-controls="vertical-tabpanel-2"
        />
      </Tabs>
      <TabPanel
        value={open}
        className={classes.tabPanels}
        boxClasses={classes.tabPanelBoxes}
        index={0}
      >
        {'name' in vitData
          ? <Vitessce rowHeight={150} config={vitData} theme="light" />
          : null}
      </TabPanel>
      <TabPanel
        value={open}
        className={classes.tabPanels}
        boxClasses={classes.tabPanelBoxes}
        index={1}
      >
        <ProvTable provData={provData} assayMetadata={assayMetadata} typesToSplit={['Donor', 'Sample', 'Dataset']} />
      </TabPanel>
      <TabPanel value={open} className={classes.tabPanels} index={2}>
        <span id="prov-vis-react">
          <ProvGraph provData={provData} />
        </span>
      </TabPanel>

    </div>
  );
}

VisTabs.propTypes = {
  provData: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default VisTabs;
