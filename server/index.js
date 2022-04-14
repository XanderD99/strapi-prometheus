'use strict';

const register = require('./register');
const config = require('./config');
const controllers = require('./controllers');
const routes = require('./routes');
const middlewares = require('./middlewares');

module.exports = {
  register,
  config,
  controllers,
  routes,
  middlewares,
};
