'use strict';

const { Histogram } = require('prom-client');
const { plugin_id } = require('../utils')

const labelNames = ['method', 'path', 'status'];

module.exports = {
  metrics: (config, { strapi }) => {
    const prefix = config.prefix && config.prefix !== '' && !config.prefix.endsWith('_') ? `${config.prefix}_` : '';

    const httpRequestDuration = new Histogram({
      name: `${prefix}http_request_duration_second`,
      help: 'Duration of HTTP requests in seconds',
      labelNames,
      buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5]
    });

    const httpRequestSizeBytes = new Histogram({
      name: `${prefix}http_request_size_bytes`,
      help: 'Size of HTTP requests in bytes',
      labelNames,
      buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
    });

    const httpResponseSizeBytes = new Histogram({
      name: `${prefix}http_response_size_bytes`,
      help: 'Size of HTTP response in bytes',
      labelNames,
      buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
    });

    return async (ctx, next) => {
      const start = Date.now();
      await next();

      ctx.res.once('finish', () => {
        const delta = Date.now() - start;
        if (ctx._matchedRoute === `${strapi.config.api.rest.prefix}/metrics`) return;
        let route = `${config.fullURL ? ctx.url.split('?')[0] : ctx._matchedRoute || '/'}`;
        if (ctx.query && config.includeQuery) {
          const query = Object.keys(ctx.query).sort().map((queryParam) => `${queryParam}=<?>`).join('&')
          route = `${route}${query ? `?${query}` : ''}`;
        }
        // add request duration metric
        httpRequestDuration.labels(ctx.method, route, ctx.status).observe(delta / 1000);

        // calculate request size
        const requestSize = parseInt(ctx.request.get('Content-Length')) || parseInt(ctx.request.get('content-length')) || 0;
        httpRequestSizeBytes.labels(ctx.method, route, ctx.status).observe(requestSize);

        // calculate response size
        const responseSize = parseInt(ctx.response.get('Content-Length')) || parseInt(ctx.response.get('content-length')) || 0;
        httpResponseSizeBytes.labels(ctx.method, route, ctx.status).observe(responseSize);
      });
    };
  }
};
