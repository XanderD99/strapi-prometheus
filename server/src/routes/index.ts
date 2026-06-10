import type { Core } from '@strapi/types';

const buildRoutes = (): Core.RouterInput['routes'] => {
  const serverConfig: false | { port: number, host: string, path: string } = strapi.plugin('prometheus').config('server');

  // The in-app metrics route only exists when the dedicated metrics server is
  // disabled (`server: false`). Otherwise metrics are served by the dedicated
  // server started in register().
  if (typeof serverConfig !== 'boolean') return [];

  return [
    {
      method: 'GET',
      path: '/metrics',
      handler: 'metrics.find',
      config: {
        // Mounted as an admin route guarded by `isAuthenticatedAdmin` so that a
        // content-api permission mis-grant (e.g. granting the Public role read
        // access) cannot expose metrics to unauthenticated clients.
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ];
};

export default {
  admin: () => ({
    type: 'admin' as const,
    routes: buildRoutes(),
  }),
};
