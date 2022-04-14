'use strict';

const { koaMiddleware } = require('prometheus-api-metrics');

module.exports = {
  metrics: (options) => {
    options.excludeRoutes.push("/api/metrics");
    return koaMiddleware(options);
  }
};
