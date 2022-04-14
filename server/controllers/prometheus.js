'use strict';

const { register } = require('prom-client');

module.exports = {
  async metrics(ctx) {
    if (ctx.query && ctx.query.json) {
      ctx.body = await register.getMetricsAsJSON();
    } else {
      ctx.response.headers['Content-Type'] = register.contentType;

      ctx.body = await register.metrics();
    }
  },
};
