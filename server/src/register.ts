import type { Core } from '@strapi/strapi';
import prom, { Gauge } from 'prom-client';
import metricsMiddleware from './middlewares/metrics';

const versionMetric = new Gauge({
  name: 'strapi_version_info',
  help: 'Strapi version info',
  labelNames: ['version','major','minor','patch']
});

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  const { config } = strapi.plugin('prometheus');

  const labels = config('labels');
  if (labels) prom.register.setDefaultLabels(config('labels'));

  const collectDefaults = config('collectDefaultMetrics');
  if (collectDefaults) prom.collectDefaultMetrics(collectDefaults);

  strapi.server.use(metricsMiddleware);

  const serverConfig: false | { port: number, host: string, path: string } = strapi.plugin('prometheus').config('server');

  if (typeof serverConfig === 'boolean' && !serverConfig) return;

  const http = await import('http');

  const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === serverConfig.path) {
      // Replace this with your logic to generate metrics data
      const data = await prom.register.metrics()
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(data);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  server.listen(serverConfig.port, serverConfig.host, () => {
    strapi.log.info(`Serving metrics on http://${serverConfig.host}:${serverConfig.port}${serverConfig.path}`);
  });

  strapi.plugin('prometheus').destroy = async () => {
    server.close();
  };

  const version = require('@strapi/strapi/package.json').version;
  const [major, minor, patch] = version.split('.')
  versionMetric.set({version,major,minor,patch}, 1)
};

