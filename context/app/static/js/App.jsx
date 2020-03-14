import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import Details from './components/Details';
import NoticeAlert from './components/NoticeAlert';
import Footer from './footer';
import Header from './header';

export default function App(props) {
  const { flaskData } = props;

  const getComponentView = () => {
    // Temp routing solution for showing the correct react component.
    if (window.location.pathname.indexOf('browse/dataset/') > -1) {
      return (
        <span>
          <NoticeAlert errors={flaskData.flashed_messages} />
          <Details
            assayMetaData={flaskData.entity}
            provData={flaskData.provenance}
            vitData={flaskData.vitessce_conf}
          />
        </span>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <div className="main-content">
        {getComponentView()}
        <div className="push" /> {/* for the sticky footer */}
      </div>
      <Footer />
    </ThemeProvider>
  );
}
