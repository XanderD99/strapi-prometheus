'use strict';

const { koaMiddleware } = require('prometheus-api-metrics');

module.exports = {
  metrics: (options, { strapi }) => {
    return koaMiddleware()
  }
};
