# Strapi prometheus plugin

A wrapper plugin around the `prometheus-api-metrics` package.

## ⏳ Installation

```bash
npm i strapi-prometheus
```

Metrics should be available at `<host>/api/strapi-prometheus/metrics`

### Middleware

Simply add the middleware to the middleware.js file.

```js
// config/middlewares.js

module.exports = [
  // ...
  'plugin::strapi-prometheus.metrics',
];
```

Or add config variables to the middleware. Config options can be found

```js
// config/middlewares.js
module.exports = [
  // ...
  {
    name: 'plugin::strapi-prometheus.metrics',
    config: {
      defaultMetricsInterval: 20000,
      // ...
    }
  }
];
```

#### Options

| Option                   | Type      | Description | Default Value |
|--------------------------|-----------|-------------|---------------|
| `defaultMetricsInterval` | `Number`  | Interval to collect the process metrics in milliseconds | `10000` |
| `durationBuckets`        | `Array<Number>` | Buckets for response time in seconds | `[0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5]` |
| `requestSizeBuckets`     | `Array<Number>` | Buckets for request size in bytes | `[5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]` |
| `responseSizeBuckets`    | `Array<Number>` | Buckets for response size in bytes | `[5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]` |
| `useUniqueHistogramName` | `Boolean` | Add to metrics names the project name as a prefix (from package.json) | `false` |
| `metricsPrefix`          | `String`  | A custom metrics names prefix, the package will add underscore between your prefix to the metric name | |
| `excludeRoutes`          | `Array<String>` | Array of routes to exclude. Routes should be in your framework syntax | |
| `includeQueryParams`     | `Boolean` | Indicate if to include query params in route, the query parameters will be sorted in order to eliminate the number of unique labels | `false` |
| `additionalLabels`       | `Array<String>` | Indicating custom labels that can be included on each `http_*` metric. Use in conjunction with `extractAdditionalLabelValuesFn`. |
| `extractAdditionalLabelValuesFn` | `Function` | A function that can be use to generate the value of custom labels for each of the `http_*` metrics. When using koa, the function takes `ctx`, when using express, it takes `req, res` as arguments | |

## ✨ Features

- [Collect API metrics for each call](#usage)
  - Response time in seconds
  - Request size in bytes
  - Response size in bytes
  - Add prefix to metrics names - custom or project name
  - Exclude specific routes from being collect
  - Number of open connections to the server
- Process Metrics as recommended by Prometheus [itself](https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors)
- Endpoint to retrieve the metrics - used for Prometheus scraping
  - Prometheus format
- Support custom metrics

## ⚙️ Versions

- **Strapi v4**

## 🖐 Requirements

### Minimum environment requirements

- Node.js `>=14.x.x`
- NPM `>=6.x.x`

We are following the [official Node.js releases timelines](https://nodejs.org/en/about/releases/).

### Supported Strapi versions

- Strapi v4.x
