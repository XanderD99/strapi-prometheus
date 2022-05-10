# Strapi prometheus plugin

A simple middleware plugin that adds prometheus metrics to strapi using `prom-client`;

## ✨ Features

- Collect API metrics for each call
  - Response time in seconds
  - Request size in bytes
  - Response size in bytes
- Process Metrics as recommended by Prometheus [itself](https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors)
- Endpoint to retrieve the metrics - used for Prometheus scraping
- Support custom metrics

## ⏳ Installation

```bash
npm i strapi-prometheus
```

### Plugin

```js
// config/plugins.js

// enable plugin with default configuration.
module.exports = [
  'strapi-prometheus': {
    enabled: true,
    config: {
      // add prefix to all the prometheus metrics names.
      prefix: '',

      // use full url instead of matched url
      // if true sets path label to `/api/models/1`
      // if false sets path label as `/api/models/:id`
      fullURL: false,

      // include url query in the url label
      // if true sets path label to `/api/models?limit=1`
      // if false sets path label to `/api/models`
      includeQuery: false,

      // collect default metrics of `prom-client`
      defaultMetrics: true,
    }
  }
];
```

### Middleware

If you want to collect response time in seconds, request size in bytes and response size in bytes add the middleware.

```js
// config/middlewares.js

module.exports = [
  // ...
  'plugin::strapi-prometheus.metrics',
];
```

### Metrics

Metrics are exposed at `/api/metrics`.

You can pass a format in the url to either get metrics in json format or plain text. Available options are `json` and `text`. Default is `text`. ex: `/api/metrics?format=text`

## 👮‍♀️ Security

By default no one can access the `/api/metrics` url. You can give access to authenticated users or to the public from the user-permission roles, another option is creating a api key. Making this public is not recommended as a lot of data is shown.

Use at own risk.

## 🖐 Requirements

### Minimum environment requirements

- Node.js `>=14.x.x`
- NPM `>=6.x.x`

We are following the [official Node.js releases timelines](https://nodejs.org/en/about/releases/).

### Supported Strapi versions

- Strapi v4.x

## 📊 Prometheus example

here is a basic example of prometheus config. In this example we assume that the metrics endpoint is not secured.

```yml
# prometheus.yaml

global:
  scrape_interval: 5s
scrape_configs:
  - job_name: "api"
    metrics_path: "/api/metrics"
    static_configs:
      - targets: ["localhost:1337"]
```

## 📊 Grafana dashboards

Here are some usefull dashboards you can start with. If you want to have your dashboard added feel free to open a PR.

- [14565](https://grafana.com/grafana/dashboards/14565)
