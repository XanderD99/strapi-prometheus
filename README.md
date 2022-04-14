# Strapi prometheus plugin

A simple middleware plugin that adds prometheus metrics to strapi using `prom-client`;

## ⏳ Installation

```bash
npm i strapi-prometheus
```

Metrics should be available at `<host>/api/strapi-prometheus/metrics`

Get the metrics as a json by adding the json query `<host>/api/strapi-prometheus/metrics?json=1`

### Middleware

Simply add the middleware to the middleware.js file.

```js
// config/middlewares.js

module.exports = [
  // ...
  'plugin::strapi-prometheus.metrics',
];
```

Or pass options to the middleware

```js
// config/middlewares.js

module.exports = [
  // ...
  {
    name: 'plugin::strapi-prometheus.metrics',
    config: {
      fullURL: true,
      includeQuery: true,
    }
  }
];
```

#### Options

| Option                   | Type      | Description | Default Value |
|--------------------------|-----------|-------------|---------------|
|fullURL|boolean|get full url instead of matched url. (with: /api/users/1, without: /api/users/:id)| false|
|includeQuery|boolean|include the query in the path label| false|

## ✨ Features

- Collect API metrics for each call
  - Response time in seconds
  - Request size in bytes
  - Response size in bytes
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
