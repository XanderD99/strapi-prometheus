'use strict';

const { metricNames } = require('../services/metrics');
const { plugin_id } = require('../utils')

module.exports = {
  metrics: ({ strapi }) => {
    const { config, service } = strapi.plugin(plugin_id);
    const metrics = service('metrics');

    return async (ctx, next) => {
      const start = Date.now();
      await next();

      ctx.res.once('finish', () => {
        const delta = Date.now() - start;
        if (ctx._matchedRoute === `${strapi.config.api.rest.prefix}/metrics`) return;
        let route = `${config('fullURL') ? ctx.url.split('?')[0] : ctx._matchedRoute || '/'}`;
        if (ctx.query && config('includeQuery')) {
          const query = Object.keys(ctx.query).sort().map((queryParam) => `${queryParam}=<?>`).join('&')
          route = `${route}${query ? `?${query}` : ''}`;
        }
        // add request duration metric
        metrics.get(metricNames.HTTP.requestDuration)?.labels(ctx.method, route, ctx.status).observe(delta / 1000);

        // calculate request size
        const requestSize = parseInt(ctx.request.get('Content-Length')) || parseInt(ctx.request.get('content-length')) || 0;
        metrics.get(metricNames.HTTP.requestSize)?.labels(ctx.method, route, ctx.status).observe(requestSize);

        // calculate response size
        const responseSize = parseInt(ctx.response.get('Content-Length')) || parseInt(ctx.response.get('content-length')) || 0;
        metrics.get(metricNames.HTTP.responseSize)?.labels(ctx.method, route, ctx.status).observe(responseSize);
      });
    };
  }
};
