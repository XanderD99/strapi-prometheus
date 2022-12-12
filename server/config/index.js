'use strict';

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
    defaultMetrics: true,
    interval: 10_000,
    includeQuery: false,
    fullURL: false,
    customLabels: {},
  }),
  validator: async (config) => {
    await schema.validate(config);
  },
};
