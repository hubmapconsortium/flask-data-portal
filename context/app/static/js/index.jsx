import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import './index.css';
import App from './App';
import Footer from './footer';
import Header from './header';

if (window.location.search.indexOf('react') > -1) {
  ReactDOM.render( // eslint-disable-next-line no-undef
    <App flaskData={flaskData} />,
    document.getElementById('react-content'),
  );
} else { // temp solution to integrate react header and footer
  ReactDOM.render( // eslint-disable-next-line no-undef
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
    </ThemeProvider>,
    document.getElementById('react-header'),
  );
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Footer />
    </ThemeProvider>,
    document.getElementById('react-footer'),
  );
}
