/**
 * Application methods
 */
import register from './register';
import bootstrap from './bootstrap';

/**
 * Plugin server methods
 */
import config from './config';
import controllers from './controllers';
import routes from './routes';
import policies from './policies';

export default { register, bootstrap, config, controllers, routes, policies };
