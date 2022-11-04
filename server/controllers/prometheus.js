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
        ctx.badRequest('Invalid format. possible format: text, json');
    }
  },
  async findOne(ctx) {
    switch (ctx.query.format || 'text') {
      case 'text':
        ctx.response.headers['Content-Type'] = register.contentType;
        await register.getSingleMetricAsString(ctx.params.name)
          .then((metric) => ctx.body = metric)
          .catch(() => ctx.notFound())
        break;
      case 'json':
        ctx.response.headers['Content-Type'] = 'application/json';
        const metrics = await register.getMetricsAsJSON();
        ctx.body = metrics.find(({ name }) => name === ctx.params.name);
        if (!ctx.body) {
          return ctx.notFound()
        }
        break;
      default:
        ctx.badRequest('Invalid format. possible format: text, json');
    }
  },
};
