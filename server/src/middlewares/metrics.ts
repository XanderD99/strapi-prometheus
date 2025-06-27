import { Counter, exponentialBuckets, Gauge, Histogram } from "prom-client";

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

function getRoutePattern(ctx: any): string {
  // First try the matched route (available after routing)
  if (ctx._matchedRoute) {
    return ctx._matchedRoute;
  }

  // Fallback to normalized path
  return normalizePath(ctx.path);
}

/**
 * Normalize path to reduce metric cardinality when matched route isn't available
 */
function normalizePath(path: string): string {
  return path
    // Strapi API routes: /api/articles/123 -> /api/articles/:id
    .replace(/\/api\/([^\/]+)\/\d+(?:\/.*)?$/, '/api/$1/:id')
    // Generic numeric IDs
    .replace(/\/\d+/g, '/:id')
    // UUIDs
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:uuid')
    // File uploads
    .replace(/\/uploads\/[^\/]+\.[a-zA-Z0-9]+/, '/uploads/:file')
    // Clean up
    .replace(/\/+/g, '/')
    .replace(/\/$/, '') || '/';
}


export default async (ctx, next) => {
  const end = requestDurationSeconds.startTimer();

  await next();

  // Create final labels with all information
  const labels = {
    method: ctx.method,
    route: getRoutePattern(ctx),
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
