'use strict';

const config = require('./config');
const controllers = require('./controllers');
const routes = require('./routes');
const middlewares = require('./middlewares');

module.exports = {
  config,
  controllers,
  routes,
  middlewares,
};
