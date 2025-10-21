import { exponentialBuckets, Histogram, register } from 'prom-client';
import { Context } from 'koa';
import { NormalizationConfig, PathNormalizationRule, MetricsConfig } from 'src/config';

// A type alias for the collection of metrics to be managed.
type HttpRequestMetrics = {
  requestDurationSeconds: Histogram<string>;
  requestContentLengthBytes: Histogram<string>;
  responseContentLengthBytes: Histogram<string>;
};

// Declare metrics but do not initialize them. They will be created lazily
// on the first request to ensure the Strapi config is available.
let metrics: HttpRequestMetrics | null = null;

// The full set of all possible labels for the metrics.
const ALL_POSSIBLE_LABELS = ['origin', 'method', 'route', 'status'];

/**
 * Initializes the Prometheus metrics based on the plugin configuration.
 * This function is designed to be called only once.
 */
function initializeMetrics(): HttpRequestMetrics {
  const metricsConfig: MetricsConfig = strapi.plugin('prometheus').config('metrics');
  const excludedLabels: string[] = metricsConfig?.excludedLabels || [];

  // Dynamically determine the final list of label names by filtering out excluded ones.
  const labelNames = ALL_POSSIBLE_LABELS.filter((label) => !excludedLabels.includes(label));

  // Before creating new metrics, remove any old ones with the same name.
  // This prevents 'Duplicate metric name' errors during hot-reloads in development.
  register.removeSingleMetric('http_request_duration_seconds');
  register.removeSingleMetric('http_request_content_length_bytes');
  register.removeSingleMetric('http_response_content_length_bytes');

  const requestDurationSeconds = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames, // Use the dynamically generated label names
    buckets: [
      0.001, // 1 ms
      0.005, // 5 ms
      0.01, // 10 ms
      0.05, // 50 ms
      0.1, // 100 ms
      0.2, // 200 ms
      0.5, // 500 ms
      1, // 1 second
      2, // 2 seconds
      5, // 5 seconds
      10, // 10 seconds
    ],
  });

  const requestContentLengthBytes = new Histogram({
    name: 'http_request_content_length_bytes',
    help: 'Histogram of the size of payloads sent to the server, measured in bytes.',
    labelNames, // Use the dynamically generated label names
    buckets: exponentialBuckets(1024, 2, 20), // Buckets from 1 KB to ~1 GB
  });

  const responseContentLengthBytes = new Histogram({
    name: 'http_response_content_length_bytes',
    help: 'Histogram of the size of payloads sent by the server, measured in bytes.',
    labelNames, // Use the dynamically generated label names
    buckets: exponentialBuckets(1024, 2, 20), // Buckets from 1 KB to ~1 GB
  });

  return {
    requestDurationSeconds,
    requestContentLengthBytes,
    responseContentLengthBytes,
  };
}

/**
 * Normalize path to reduce metric cardinality when matched route isn't available
 */
function normalizePath(path: string, rules: PathNormalizationRule[]): string {
  for (const [regex, replacement] of rules) {
    path = path.replace(regex, replacement);
  }

  return path;
}

export default async (ctx: Context, next) => {
  // Lazily initialize metrics on the first request. This ensures that the Strapi
  // config is available and that metrics are only defined once.
  if (!metrics) {
    metrics = initializeMetrics();
  }

  const normalizeConfig: NormalizationConfig = strapi.plugin('prometheus').config('normalize');

  let route = ctx.path;
  if (normalizeConfig) {
    if (Array.isArray(normalizeConfig)) route = normalizePath(ctx.path, normalizeConfig);
    else if (typeof normalizeConfig === 'function') route = normalizeConfig.call(null, ctx);
  }

  const end = metrics.requestDurationSeconds.startTimer();

  await next();

  // Collect all possible label values from the context.
  const allLabelValues = {
    method: ctx.method,
    route,
    origin: ctx.headers.origin || 'unknown',
    status: ctx.status,
  };

  // Build the final labels object, only including the keys that are
  // actively configured for the metrics. This is required by prom-client.
  const labels = {};
  for (const labelName of metrics.requestDurationSeconds.labelNames) {
    labels[labelName] = allLabelValues[labelName];
  }

  ctx.res.once('finish', () => {
    end(labels);

    const requestContentLength = ctx.request.get('Content-Length') || ctx.request.get('content-length');
    if (requestContentLength) {
      const parsedRequestContentLength = parseInt(requestContentLength, 10);
      if (!isNaN(parsedRequestContentLength) && isFinite(parsedRequestContentLength)) {
        metrics.requestContentLengthBytes.observe(labels, parsedRequestContentLength);
      }
    }

    const responseContentLength = ctx.response.get('Content-Length') || ctx.response.get('content-length');
    if (responseContentLength) {
      const parsedResponseContentLength = parseInt(responseContentLength, 10);
      if (!isNaN(parsedResponseContentLength) && isFinite(parsedResponseContentLength)) {
        metrics.responseContentLengthBytes.observe(labels, parsedResponseContentLength);
      }
    }
  });
};