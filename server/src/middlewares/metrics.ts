import { Core } from "@strapi/strapi";
import { Counter, exponentialBuckets, Gauge, Histogram } from "prom-client";

const requestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: exponentialBuckets(.001, 1.6, 14)
});

const requestContentLengthBytes = new Histogram({
  name: 'http_request_content_length_bytes',
  help: 'The size of the payload being sent to the server',
  labelNames: ['method', 'path', 'status'],
  buckets: exponentialBuckets(512000, 2, 10) // Buckets from 500KB up to ~500MB
});

const responseContentLengthBytes = new Histogram({
  name: 'http_response_content_length_bytes',
  help: 'The size of the payload being sent to the server',
  labelNames: ['method', 'path', 'status'],
  buckets: exponentialBuckets(512000, 2, 10) // Buckets from 500KB up to ~500MB
});

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

const httpActiveRequests = new Gauge({
  name: 'http_active_requests',
  help: 'Number of active HTTP requests',
  labelNames: ['method', 'path'],
});

const httpErrorsTotal = new Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'path', 'status'],
});

export default async (ctx, next) => {
  const labels = { path: ctx.path, method: ctx.method }

  httpActiveRequests.inc(labels)
  const end = requestDurationSeconds.startTimer(labels);
  await next();

  ctx.res.once('finish', () => {
    // add request duration metric
    end({ ...labels, status: ctx.status });

    httpActiveRequests.dec(labels)

    if (ctx.status >= 400) {
      httpErrorsTotal.inc({ ...labels, status: ctx.status });
    }

    httpRequestsTotal.inc({ ...labels, status: ctx.status })

    // calculate request size
    const requestSize = parseInt(ctx.request.get('Content-Length')) || parseInt(ctx.request.get('content-length')) || 0;
    requestContentLengthBytes.observe({ ...labels, status: ctx.status }, requestSize);

    // calculate response size
    const responseSize = parseInt(ctx.response.get('Content-Length')) || parseInt(ctx.response.get('content-length')) || 0;
    responseContentLengthBytes.observe({ ...labels, status: ctx.status }, responseSize);
  });
};
