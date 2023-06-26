'use strict';

const { metricNames } = require('../services/metrics');
const { plugin_id } = require('../utils')

module.exports = {
  metrics: ({ strapi }) => {
    const { config, service } = strapi.plugin(plugin_id);
    const metrics = service('metrics');
    const isHTTPMetricEnabled = config('enabledMetrics.http');

    return async (ctx, next) => {
      const requestEnd = metrics.get(metricNames.HTTP.requestDuration)?.startTimer({ method: ctx.method });
      await next();

      if (!isHTTPMetricEnabled) return;
      ctx.res.once('finish', () => {
        if (ctx._matchedRoute === `${strapi.config.api.rest.prefix}/metrics`) return;
        let path = `${config('fullURL') ? ctx.url.split('?')[0] : ctx._matchedRoute || '/'}`;
        if (ctx.query && config('includeQuery')) {
          const query = Object.keys(ctx.query).sort().map((queryParam) => `${queryParam}=<?>`).join('&')
          path = `${path}${query ? `?${query}` : ''}`;
        }

        // add request duration metric
        requestEnd({ path, status: ctx.status });

        // calculate request size
        const requestSize = parseInt(ctx.request.get('Content-Length')) || parseInt(ctx.request.get('content-length')) || 0;
        metrics.get(metricNames.HTTP.requestSize)?.labels(ctx.method, path, ctx.status).observe(requestSize);

        // calculate response size
        const responseSize = parseInt(ctx.response.get('Content-Length')) || parseInt(ctx.response.get('content-length')) || 0;
        metrics.get(metricNames.HTTP.responseSize)?.labels(ctx.method, path, ctx.status).observe(responseSize);
      });
    };
  }
};
