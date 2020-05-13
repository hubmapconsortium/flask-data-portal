/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import NoticeAlert from './components/NoticeAlert';
import Details from './components/Details';
import Home from './components/Home';
import Search from './components/Search/Search';

function Routes(props) {
  const { flaskData } = props;
  const {
    flashed_messages, entity, provenance, vitessce_conf, endpoints, title,
  } = flaskData;
  const urlPath = window.location.pathname;

  if (urlPath.startsWith('/browse')) {
    return (
      <>
        {flashed_messages && flashed_messages.length
          ? <NoticeAlert errors={flashed_messages} /> : null}
        <Details
          assayMetadata={entity}
          provData={provenance}
          vitData={vitessce_conf}
        />
      </>
    );
  }

  if (urlPath === '/') {
    return (
      <Home />
    );
  }

  if (urlPath.startsWith('/search')) {
    return (
      <Search esEndpoint={endpoints.esEndpoint} title={title} />
    );
  }
}

Routes.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    flashed_messages: PropTypes.array,
    provenance: PropTypes.object,
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
  }),
};

Routes.defaultProps = {
  flaskData: {},
};

export default Routes;
