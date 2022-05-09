"use strict";
const { collectDefaultMetrics } = require('prom-client');
const { plugin_id } = require('./utils')

module.exports = async ({ strapi }) => {
  const config = strapi.config.get(`plugin.${plugin_id}`);
  const prefix = config.prefix && config.prefix !== '' && !config.prefix.endsWith('_') ? `${config.prefix}_` : '';

  if (config.defaultMetrics) {
    collectDefaultMetrics({ prefix });
  }
};
