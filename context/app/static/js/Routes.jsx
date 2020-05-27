/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Home from './components/Home';
import Search from './components/Search/Search';
import DonorDetail from './components/DonorDetail';
import SampleDetail from './components/SampleDetail';
import DatasetDetail from './components/DatasetDetail';

function Routes(props) {
  const { flaskData } = props;
  const {
    flashed_messages, entity, vitessce_conf, endpoints, title,
  } = flaskData;
  const urlPath = window.location.pathname;

  if (urlPath.startsWith('/browse/donor/')) {
    return (
      <DonorDetail
        assayMetadata={entity}
        vitData={vitessce_conf}
        flashed_messages={flashed_messages}
        entityEndpoint={endpoints.entityEndpoint}
      />
    );
  }
  if (urlPath.startsWith('/browse/sample/')) {
    return (
      <SampleDetail
        assayMetadata={entity}
        vitData={vitessce_conf}
        flashed_messages={flashed_messages}
        entityEndpoint={endpoints.entityEndpoint}
      />
    );
  }

  if (urlPath.startsWith('/browse/dataset/')) {
    return (
      <DatasetDetail
        assayMetadata={entity}
        vitData={vitessce_conf}
        flashed_messages={flashed_messages}
        assetsEndpoint={endpoints.assetsEndpoint}
        entityEndpoint={endpoints.entityEndpoint}
      />
    );
  }

  if (urlPath === '/') {
    return (
      <Home />
    );
  }

  if (urlPath.startsWith('/search')) {
    return (
      <Search elasticsearchEndpoint={endpoints.elasticsearchEndpoint} title={title} />
    );
  }
}

Routes.propTypes = {
  flaskData: PropTypes.exact({
    title: PropTypes.string,
    entity: PropTypes.object,
    flashed_messages: PropTypes.array,
    vitessce_conf: PropTypes.object,
    endpoints: PropTypes.object,
  }),
};

Routes.defaultProps = {
  flaskData: {},
};

export default Routes;
