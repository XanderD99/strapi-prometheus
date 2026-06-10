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
        // Skip the default admin auth and guard the route with our own API key
        // policy instead, so it can be scraped with a static `Authorization:
        // Bearer <apiKey>` header rather than an admin session token.
        auth: false,
        policies: ['plugin::prometheus.hasApiKey'],
      },
    },
  ];
};

export default {
  admin: () => ({
    type: 'admin' as const,
    // Mount at the server root so the endpoint is `/metrics` rather than
    // `/prometheus/metrics`.
    prefix: '',
    routes: buildRoutes(),
  }),
};
