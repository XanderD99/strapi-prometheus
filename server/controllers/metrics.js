'use strict';

const { register } = require('prom-client');

module.exports = {
  async metrics(ctx) {
    ctx.response.headers['Content-Type'] = register.contentType;

    ctx.body = await register.metrics();
  },
};
