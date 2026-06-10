import type { Core } from '@strapi/types';
import { createContentApiRoutesFactory } from '@strapi/utils';

const createRoutes = createContentApiRoutesFactory((): Core.RouterInput['routes'] => {
  const serverConfig: false | { port: number, host: string, path: string } = strapi.plugin('prometheus').config('server');

  if (typeof serverConfig !== 'boolean') return []

  return [
    {
      method: 'GET',
      path: '/metrics',
      handler: 'metrics.find',
      config: {
        prefix: '/'
      }
    },
  ];
});


export default {
  'content-api': createRoutes
}
