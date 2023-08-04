"use strict";
const { collectDefaultMetrics } = require('prom-client');
const { httpMetrics, apolloMetrics, koaMetrics, metricNames } = require('./services/metrics');
const { plugin_id } = require('./utils')

function getConnections(strapi) {
  const { service } = strapi.plugin(plugin_id);

  strapi.server.httpServer.getConnections((error, count) => {
    if (error) {
      debug('Error while collection number of open connections', error);
    } else {
      service('metrics').get(metricNames.koa.openConnections)?.set(count)
    }
  })
}

module.exports = async ({ strapi }) => {
  const { config, service } = strapi.plugin(plugin_id);

  const prefix = config('prefix') ? `${config('prefix')}_` : undefined;

  const register = service('registry');
  const metrics = service('metrics');

  if (config('customLabels')) {
    register.setDefaultLabels(config('customLabels'));
  }

  const metricsConfig = config('enabledMetrics');
  if (metricsConfig.process) {
    collectDefaultMetrics({ prefix, timeout: config.timeout, register });
  }

  if (metricsConfig.koa) {
    metrics.register(koaMetrics)
    setInterval(() => getConnections(strapi), config.interval).unref()
  }

  if (metricsConfig.http) {
    metrics.register(httpMetrics)
  }

  if (metricsConfig.apollo) {
    metrics.register(apolloMetrics)
  }
};
