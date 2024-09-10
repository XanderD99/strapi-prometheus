"use strict";
const MetricServer = require('../metrics/metrics');
const { metrics } = require('./middlewares');
const { plugin_id } = require('./utils');

module.exports = ({ strapi }) => {
  strapi.server.use(metrics({ strapi }))

  const { config, service } = strapi.plugin(plugin_id);
  const server = config('server')
  if (server.enabled) {
    const register = service('registry');
    strapi.metrics = new MetricServer(server, register, strapi.log)
  }
}
