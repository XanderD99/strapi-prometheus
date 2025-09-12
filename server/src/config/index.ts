import { DefaultMetricsCollectorConfiguration, RegistryContentType } from "prom-client";
import { Context } from "koa";

export type PathNormalizationRule = [RegExp, string];

/**
 * Normalization configuration can be:
 * - Array of normalization rules (tuples of [RegExp, string])
 * - Function that takes context and returns either a normalized string
 */
export type NormalizationConfig = PathNormalizationRule[] | ((ctx: Context) => string);

export interface Config {
  labels: object;
  collectDefaultMetrics: false | DefaultMetricsCollectorConfiguration<RegistryContentType>;
  server: false | { port: number, host: string, path: string };
  normalize: NormalizationConfig;
}

export default {
  default: {
    normalize: [
      [/\/[a-z0-9]{24,25}|\d/, '/:id'], // Document IDs or numeric IDs
      [/\/uploads\/[^\/]+\.[a-zA-Z0-9]+/, '/uploads/:file'], // Uploaded files with extensions
    ] as PathNormalizationRule[],
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
