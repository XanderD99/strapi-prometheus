'use strict';

const { register } = require('@strapi/plugin-users-permissions/strapi-admin');
const { Registry } = require('prom-client');
const yup = require('yup');

const schema = yup.object().shape({
  defaultMetrics: yup.boolean().default(true),
  enabledMetrics: yup.object().shape({
    process: yup.boolean().default(true),
    koa: yup.boolean().default(true),
    http: yup.boolean().default(true),
    apollo: yup.boolean().default(false),
  }),
  interval: yup.number().default(10_000),
  prefix: yup.string(),
  includeQuery: yup.boolean().default(false),
  fullURL: yup.boolean().default(false),
  customLabels: yup.object().default(undefined),
  registers: yup.array().default([]),

  server: yup.object().shape({
    enabled: yup.boolean().default(false),
    port: yup.number().default(9000),
    host: yup.string().default('0.0.0.0'),
    path: yup.string().default('/metrics')
  }),
});

module.exports = {
  default: (test) => {
    return {
      register: new Registry(),
      ...schema.default(),
    }
  },
  validator: async (config) => {
    await schema.validate(config);
  },
};
