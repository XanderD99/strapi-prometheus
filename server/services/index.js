const { plugin_id } = require('../utils')
const metrics = require('./metrics');

module.exports = {
  registry() {
    const { config } = strapi.plugin(plugin_id);

    return config('register');
  },
  prefix() {
    const { config } = strapi.plugin(plugin_id);

    const prefix = config('prefix')
    return prefix && prefix !== '' && !prefix.endsWith('_') ? `${config.prefix}_` : '';
  },
  metrics: metrics.service,
}
