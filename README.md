# Strapi prometheus plugin

![strapi-prometheus-downloads](https://img.shields.io/npm/dt/strapi-prometheus.svg?maxAge=3600)
![strapi-prometheus-version](https://img.shields.io/npm/v/strapi-prometheus?maxAge=3600)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/xanderd)

A simple middleware plugin that adds prometheus metrics to strapi using `prom-client`;

## ✨ Features

- Collect API metrics for each call
  - Response time in seconds
  - Request size in bytes
  - Response size in bytes
  - Number of open connections
- Collect apollo Graphql metrics
  - query duration
  - queries validated
  - queries parsed
- Process Metrics as recommended by [Prometheus](https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors)
- Endpoint to retrieve the metrics - used for Prometheus scraping
- Endpoint to get specific metric
- Set custom labels
- custom registrer
- mutliple registers

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
      // true  => path label: `/api/models/1`
      // false => path label: `/api/models/:id`
      fullURL: false,

      // include url query in the url label
      // true  => path label: `/api/models?limit=1`
      // false => path label: `/api/models`
      includeQuery: false,

      // metrics that will be enabled, by default they are all enabled.
      enabledMetrics: {
        koa: true, // koa metrics
        process: true, // metrics regarding the running process
        http: true, // http metrics like response time and size
        apollo: true, // metrics regarding graphql
      },

      // interval at which rate metrics are collected in ms
      interval: 10_000,

      // set custom/default labels to all the prometheus metrics
      customLabels: {
        name: "strapi-prometheus",
      },
    }
  }
];
```

#### Graphql setup

```js
// config/plugins.js
const { apolloPrometheusPlugin } = require('strapi-prometheus')

module.exports = [
  'strapi-prometheus': {
    enabled: true,
  },
  graphql: {
    enabled: true,
    config: {
      apolloServer: {
        plugins: [apolloPrometheusPlugin], // add the plugin to get apollo metrics
        tracing: true, // this must be true to get some of the data needed to create the metrics
      }
    }
  }
}

```

### Metrics

Metrics are exposed at `/api/metrics`.

You can pass a format in the url to either get metrics in json format or plain text. Available options are `json` and `text`. Default is `text`. ex: `/api/metrics?format=text`

## 👮‍♀️ Security

⚠️ Use at own risk.

By default no one can access the `/api/metrics` url. This is to prevent sensitive data from the metrics being exposed by default.

To access the metrics you have 2 options:

1. create an api token with either read only access or custom access to the metrics endpoints. If you don't know how to create an api token here is [a turorial](https://www.youtube.com/watch?v=dVQKqZYWyv4)
2. using the user-permissions plugin: (NOT RECOMMENDED)
    - create a user account and allow authorized users to query the endpoints. This does give the opportunity to every user to query your metrics.
    - allow public role to query the metric endpoints. This should never be done, unless really necessary.

## 🖐 Requirements

### Minimum environment requirements

- Node.js `>=14.x.x`
- NPM `>=6.x.x`

We are following the [official Node.js releases timelines](https://nodejs.org/en/about/releases/).

### Supported Strapi versions

- Strapi v4.x

## 📊 Prometheus example

`⚠️ You need to create your own prometheus instance for this. This plugin does not do that for you!`

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
