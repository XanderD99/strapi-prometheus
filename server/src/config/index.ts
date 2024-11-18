import { DefaultMetricsCollectorConfiguration, RegistryContentType } from "prom-client";

export interface Config {
  labels: object;
  collectDefaultMetrics: false | DefaultMetricsCollectorConfiguration<RegistryContentType>
  server: false | { port: number, host: string, path: string }
}

export default {
  default: {
    collectDefaultMetrics: { prefix: '' },
    labels: [],
    server: {
      port: 9000,
      host: '0.0.0.0',
      path: '/metrics'
    }
  } as Config,
  validator(config: Config) {
    if (typeof config.collectDefaultMetrics === 'boolean' && config.collectDefaultMetrics) {
      throw Error('Invalid collectDefaultMetrics value. Can only be false or DefaultMetricsCollectorConfiguration');
    }

    if (typeof config.server === 'boolean' && config.server) {
      throw Error('Invalid server value. Can only be false or { port: number, host: string, path: string }');
    }
  },
};
