'use strict';
const { Registry } = require('prom-client')
const { plugin_id } = require('../utils')

module.exports = ({ strapi }) => {
  const { service, config } = strapi.plugin(plugin_id)
  const enabled = config('server').enabled;

  return {
    async find(ctx) {
      if (enabled) return ctx.notFound();
      const register = service('registry');
  
      switch (ctx.query.format || 'text') {
        case 'text':
          ctx.response.headers['Content-Type'] = register.contentType;
          ctx.body = await Registry.merge([register, ...config('registers')]).metrics()
          break;
        case 'json':
          ctx.response.headers['Content-Type'] = 'application/json';
          ctx.body = await Registry.merge([register, ...config('registers')]).getMetricsAsJSON();
          break;
        default:
          ctx.badRequest('Invalid format. possible format: text, json');
      }
    },
    async findOne(ctx) {
      if (enabled) return ctx.notFound();
      const register = service('registry');
  
      switch (ctx.query.format || 'text') {
        case 'text':
          ctx.response.headers['Content-Type'] = register.contentType;
          await Registry.merge([register, ...config('registers')]).getSingleMetricAsString(ctx.params.name)
            .then((metric) => ctx.body = metric)
            .catch(() => ctx.notFound())
          break;
        case 'json':
          ctx.response.headers['Content-Type'] = 'application/json';
          const metrics = await Registry.merge([register, ...config('registers')]).getMetricsAsJSON();
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
};
