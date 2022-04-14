'use strict';

const { koaMiddleware } = require('prometheus-api-metrics');

const config = require('../config');

module.exports = {
  metrics: (options) => {
    options = {
      ...config.default,
      ...options
    }
    options.excludeRoutes.push("/api/strapi-prometheus/metrics");

    return koaMiddleware(options);
  }
};
