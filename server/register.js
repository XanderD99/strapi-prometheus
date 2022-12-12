"use strict";
const { collectDefaultMetrics, register, Gauge } = require('prom-client');
const { plugin_id } = require('./utils')

function getConnections(strapi, metric) {
  strapi.server.httpServer.getConnections((error, count) => {
    if (error) {
      debug('Error while collection number of open connections', error);
    } else {
      console.log('count', count)
      metric.set(count)
    }
  })
}

module.exports = async ({ strapi }) => {
  const config = strapi.config.get(`plugin.${plugin_id}`);
  const prefix = config.prefix && config.prefix !== '' && !config.prefix.endsWith('_') ? `${config.prefix}_` : '';

  if (config.customLabels) {
    register.setDefaultLabels(config.customLabels)
  }

  if (config.defaultMetrics) {
    collectDefaultMetrics({ prefix, timeout: config.timeout });

    const nrConnections = new Gauge({
      name: `${prefix}number_of_open_connections`,
      help: 'Number of open connections to the Koa.js server',
    });

    setInterval(() => getConnections(strapi, nrConnections), config.interval).unref()
  }
};
