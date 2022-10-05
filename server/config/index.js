'use strict';

const yup = require('yup');

const schema = yup.object().shape({
  defaultMetrics: yup.boolean().required(),
  prefix: yup.string(),
  includeQuery: yup.boolean(),
  fullURL: yup.boolean(),
  customLabels: yup.object(),
});

module.exports = {
  default: {
    defaultMetrics: true,
    includeQuery: false,
    fullURL: false,
    customLabels: {},
  },
  validator: (config) => schema.validate(config),
};
