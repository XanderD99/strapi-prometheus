"use strict";

const { metrics } = require('./middlewares')

module.exports = ({ strapi }) => {
  strapi.server.use(metrics({ strapi }))
}
