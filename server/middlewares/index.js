'use strict';

const { koaMiddleware } = require('prometheus-api-metrics');

const config = require('../config');

module.exports = {
  metrics: (options) => {
    options = {
      ...config.default,
      ...options
    }
    options.excludeRoutes.push("/api/metrics");

    return koaMiddleware(options);
  }
};
