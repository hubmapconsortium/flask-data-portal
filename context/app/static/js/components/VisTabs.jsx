import React from 'react';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import ProvGraph from './ProvGraph';
import { useStyles } from '../styles';

function TabPanel(props) {
  const {
    children, value, index,
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

export default function VisTabs(props) {
  const { provData } = props;
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
          label="Visualizations"
          id="vertical-tab-0"
          aria-controls="vertical-tabpanel-0"
        />
        <Tab
          label="Provenance"
          id="vertical-tab-1"
          aria-controls="vertical-tabpanel-1"
        />
      </Tabs>
      <TabPanel value={open} index={0}>
        <span id="vit-grid">
          Vit Place Holder
        </span>
      </TabPanel>
      <TabPanel value={open} index={1}>
        <span id="prov-vis-react">
          <ProvGraph provData={provData} />
        </span>
      </TabPanel>
    </div>
  );
}
