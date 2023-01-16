'use strict';

const { Registry } = require('prom-client');
const yup = require('yup');

const schema = yup.object().shape({
  defaultMetrics: yup.boolean().default(true),
  interval: yup.number().default(10_000),
  prefix: yup.string(),
  includeQuery: yup.boolean().default(false),
  fullURL: yup.boolean().default(false),
  customLabels: yup.object(),
});

module.exports = {
  default: () => ({
    enabledMetrics: {
      process: true,
      koa: true,
      http: true,
      apollo: true,
    },
    interval: 10_000,
    includeQuery: false,
    fullURL: false,
    customLabels: {},
    register: new Registry(),
    registers: [],
  }),
  validator: async (config) => {
    await schema.validate(config);
  },
};
