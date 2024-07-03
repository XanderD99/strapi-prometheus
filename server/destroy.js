"use strict";
const MetricServer = require('../metrics/metrics');
const { metrics } = require('./middlewares');
const { plugin_id } = require('./utils');

module.exports = ({ strapi }) => {

  const {config} = strapi.plugin(plugin_id);


  const server = config('server')
  if (server.enabled) {
    strapi.metrics.stop()
  }
  
}
