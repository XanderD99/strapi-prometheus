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
      [/^\/api\/([^\/]+)\/([^\/]+)$/, '/api/$1/:id'], // /api/posts/123
      [/^\/api\/([^\/]+)\/([^\/]+)\/([^\/]+)$/, '/api/$1/:id/$3'], // /api/posts/123/comments
      [/^\/api\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)$/, '/api/$1/$2/:id/$4'], // /api/posts/123/comments/456

      // i18n locale routes (preserve locale but normalize what follows)
      [/^\/([a-z]{2}(-[A-Z]{2})?)\/api\/([^\/]+)\/([^\/]+)$/, '/$1/api/$3/:id'],
      [/^\/([a-z]{2}(-[A-Z]{2})?)\//, '/:locale/'],

      // Admin routes with complex patterns
      [/^\/admin\/content-manager\/([^\/]+)\/([^\/]+)\/([^\/]+)$/, '/admin/content-manager/$1/:contentType/:id'],
      [/^\/admin\/([^\/]+)\/([^\/]+)\/([^\/]+)$/, '/admin/$1/:type/:id'],

      [/\/uploads\/[^\/]+\.[a-zA-Z0-9]+/, '/uploads/:file'],
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
