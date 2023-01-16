'use strict';

const register = require('./register');
const config = require('./config');
const controllers = require('./controllers');
const routes = require('./routes');
const middlewares = require('./middlewares');
const bootstrap = require('./bootstrap');
const services = require('./services')

module.exports = {
  register,
  config,
  controllers,
  routes,
  middlewares,
  bootstrap,
  services
};
