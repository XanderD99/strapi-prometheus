"use strict";
const { collectDefaultMetrics, register } = require('prom-client');
const { plugin_id } = require('./utils')
const { metrics } = require('./middlewares')

module.exports = async ({ strapi }) => {
  const config = strapi.config.get(`plugin.${plugin_id}`);
  const prefix = config.prefix && config.prefix !== '' && !config.prefix.endsWith('_') ? `${config.prefix}_` : '';

  if (config.defaultMetrics) {
    collectDefaultMetrics({ prefix });
  }

  if (config.customLabels) {
    register.setDefaultLabels(config.customLabels)
  }

  strapi.server.use(metrics(config, { strapi }))
};
