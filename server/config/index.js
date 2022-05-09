'use strict';

const yup = require('yup');

const schema = yup.object().shape({
  defaultMetrics: yup.boolean().required(),
  prefix: yup.string(),
  includeQuery: yup.boolean(),
  fullURL: yup.boolean(),
});

module.exports = {
  default: {
    defaultMetrics: true,
    includeQuery: false,
    fullURL: false,
  },
  validator: (config) => schema.validate(config),
};
