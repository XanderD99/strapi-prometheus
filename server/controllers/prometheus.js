'use strict';

const { register } = require('prom-client');

module.exports = {
  async find(ctx) {
    switch (ctx.query.format || 'text') {
      case 'text':
        ctx.response.headers['Content-Type'] = register.contentType;
        ctx.body = await register.metrics();
        break;
      case 'json':
        ctx.response.headers['Content-Type'] = 'application/json';
        ctx.body = await register.getMetricsAsJSON();
        break;
      default:
        ctx.badRequest('Invalid format');
    }
  },
  async findOne(ctx) {
    switch (ctx.query.format || 'text') {
      case 'text':
        ctx.response.headers['Content-Type'] = register.contentType;
        ctx.body = await register.getSingleMetricAsString(ctx.params.name)
        break;
      case 'json':
        ctx.response.headers['Content-Type'] = 'application/json';
        ctx.body = await register.getSingleMetric(ctx.params.name);
        break;
      default:
        ctx.badRequest('Invalid format');
    }

    if (!ctx.body) {
      ctx.notFound()
    }
  },
};
