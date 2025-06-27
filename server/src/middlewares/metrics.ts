import { Counter, exponentialBuckets, Gauge, Histogram } from "prom-client";

const requestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['origin', 'method', 'path', 'status'],
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
    20,    // 20 seconds
    30     // 30 seconds
  ]
});

const requestContentLengthBytes = new Histogram({
  name: 'http_request_content_length_bytes',
  help: 'Histogram of the size of payloads sent to the server, measured in bytes.',
  labelNames: ['origin', 'method', 'path', 'status'],
  buckets: exponentialBuckets(256000, 2, 12) // Buckets starting from 250 KB to 1000 MB
});

const responseContentLengthBytes = new Histogram({
  name: 'http_response_content_length_bytes',
  help: 'Histogram of the size of payloads sent by the server, measured in bytes.',
  labelNames: ['origin', 'method', 'path', 'status'],
  buckets: exponentialBuckets(256000, 2, 12) // Buckets starting from 250 KB to 1000 MB
});

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['origin', 'method', 'path', 'status'],
});

const httpActiveRequests = new Gauge({
  name: 'http_active_requests',
  help: 'Number of active HTTP requests',
  labelNames: ['origin', 'method', 'path'],
});

export default async (ctx, next) => {
  const labels = {
    path: ctx._matchedRoute || ctx.path,
    method: ctx.method,
    origin: ctx.origin
  }

  httpActiveRequests.inc(labels)
  const end = requestDurationSeconds.startTimer(labels);
  await next();

  ctx.res.once('finish', () => {
    // add request duration metric
    end({ ...labels, status: ctx.status });

    httpActiveRequests.dec(labels)

    httpRequestsTotal.inc({ ...labels, status: ctx.status })

    const requestContentLength = ctx.request.get('Content-Length') || ctx.request.get('content-length');
    if (requestContentLength) {
      const parsedRequestContentLength = parseInt(requestContentLength, 10);
      if (!isNaN(parsedRequestContentLength) && isFinite(parsedRequestContentLength)) {
        requestContentLengthBytes.observe({ ...labels, status: ctx.status }, parsedRequestContentLength);
      }
    }
    
    const responseContentLength = ctx.response.get('Content-Length') || ctx.response.get('content-length');
    if (responseContentLength) {
      const parsedResponseContentLength = parseInt(responseContentLength, 10);
      if (!isNaN(parsedResponseContentLength) && isFinite(parsedResponseContentLength)) {
        responseContentLengthBytes.observe({ ...labels, status: ctx.status }, parsedResponseContentLength);
      } 
    }
  });
};
