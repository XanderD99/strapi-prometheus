import { exponentialBuckets, Histogram } from "prom-client";
import { Context } from "koa";
import { NormalizationConfig, PathNormalizationRule } from "src/config";

const requestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['origin', 'method', 'route', 'status'],
  buckets: [
    0.001, // 1 ms
    0.005, // 5 ms
    0.01,  // 10 ms
    0.05,  // 50 ms
    0.1,   // 100 ms
    0.2,   // 200 ms
    0.5,   // 500 ms
    1,     // 1 second
    2,     // 2 seconds
    5,     // 5 seconds
    10,    // 10 seconds
  ]
});

const requestContentLengthBytes = new Histogram({
  name: 'http_request_content_length_bytes',
  help: 'Histogram of the size of payloads sent to the server, measured in bytes.',
  labelNames: ['origin', 'method', 'route', 'status'],
  buckets: exponentialBuckets(1024, 2, 20) // Buckets starting from 1 KB to 1 GB (1024 * 2^19 = ~536 MB, 2^20 = ~1 GB)
});

const responseContentLengthBytes = new Histogram({
  name: 'http_response_content_length_bytes',
  help: 'Histogram of the size of payloads sent by the server, measured in bytes.',
  labelNames: ['origin', 'method', 'route', 'status'],
  buckets: exponentialBuckets(1024, 2, 20) // Buckets starting from 1 KB to 1 GB (1024 * 2^19 = ~536 MB, 2^20 = ~1 GB)
});

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
  const config: NormalizationConfig = strapi.plugin('prometheus').config('normalize');

  const route = Array.isArray(config) ? normalizePath(ctx.path, config) : config.call(null, ctx);

  const end = requestDurationSeconds.startTimer();

  await next();

  // Create final labels with all information
  const labels = {
    method: ctx.method,
    route,
    origin: ctx.origin || 'unknown',
    status: ctx.status
  };

  ctx.res.once('finish', () => {
    end(labels);

    const requestContentLength = ctx.request.get('Content-Length') || ctx.request.get('content-length');
    if (requestContentLength) {
      const parsedRequestContentLength = parseInt(requestContentLength, 10);
      if (!isNaN(parsedRequestContentLength) && isFinite(parsedRequestContentLength)) {
        requestContentLengthBytes.observe(labels, parsedRequestContentLength);
      }
    }

    const responseContentLength = ctx.response.get('Content-Length') || ctx.response.get('content-length');
    if (responseContentLength) {
      const parsedResponseContentLength = parseInt(responseContentLength, 10);
      if (!isNaN(parsedResponseContentLength) && isFinite(parsedResponseContentLength)) {
        responseContentLengthBytes.observe(labels, parsedResponseContentLength);
      }
    }
  });
};
