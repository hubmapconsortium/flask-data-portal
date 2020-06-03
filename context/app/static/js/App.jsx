import React from 'react';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { MuiThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import theme from './theme';
import Routes from './Routes';
import Footer from './Footer';
import Header from './Header';

const generateClassName = createGenerateClassName({
  disableGlobal: true,
  seed: 'portal',
});

function App(props) {
  const { flaskData } = props;
  return (
    <StylesProvider generateClassName={generateClassName} injectFirst>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <div className="main-content">
            <Container maxWidth="lg">
              <Routes flaskData={flaskData} />
            </Container>
          </div>
          <Footer />
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
}

App.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    flashed_messages: PropTypes.array,
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
  }),
};

App.defaultProps = {
  flaskData: {},
};

export default App;
