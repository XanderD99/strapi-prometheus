# Strapi prometheus plugin

![strapi-prometheus-downloads](https://img.shields.io/npm/dt/strapi-prometheus.svg?maxAge=3600)
![strapi-prometheus-version](https://img.shields.io/npm/v/strapi-prometheus?maxAge=3600)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/xanderd)

A simple middleware plugin that adds prometheus metrics to strapi using `prom-client`;

## ✨ Features

- Collect API metrics for each call
- Process Metrics as recommended by [Prometheus](https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors)
- Endpoint to retrieve the metrics - used for Prometheus scraping
- Set custom labels

## ⏳ Installation

```bash
npm i strapi-prometheus
```

### Plugin

```js
// config/plugins.js

// enable plugin with default configuration.
module.exports = [
  prometheus: {
    enabled: true,
    config: {
      // see collectDefaultMetricsOption of prom-client
      collectDefaultMetrics: false || { prefix: 'strapi_' }
      labels: { name: "strapi-prometheus" },
      server: false || { port: 9000, host: '0.0.0.0', path: '/metrics' }
    }
  }
];
```

## 📊 Metrics

|name|description|type|
|---|---|---|---|
|http_request_duration_seconds|Duration of HTTP requests in seconds|Histogram|
|http_request_content_length_bytes|Histogram of the size of payloads sent to the server, measured in bytes.|Histogram|
|http_response_content_length_bytes|Histogram of the size of payloads sent by the server, measured in bytes.|Histogram|
|http_requests_total|Total number of HTTP requests|Counter|
|http_active_requests|Number of active HTTP requests|Gauge|
|http_errors_total|Total number of HTTP errors|Counter|
|strapi_version_info|Strapi version info|Gauge|
|lifecycle_duration_seconds|'Tracks the duration of Strapi lifecycle events in seconds|Histogram|

## 👮‍♀️ Security

> [!CAUTION]
> Use at own risk. Metric data can sometimes hold sensitive data that should not be publically available.

To keep your information secure, the plugin by default starts a new server on port `9000` so that your metrics aren't available to the outside world.

If this is not an option for you. You can disable this by updating the server config and setting it to `false`. This will then create an `/metrics` endpoint on your strapi server. This is secured by the strapi auth middleware so you will need to create a API token to be able to access it. I well mention it again this is not the recommended way, you should try and use the separate server.

## 🖐 Supported Strapi versions

- Strapi v4.x (strapi-prometheus v1.x.x)
- Strapi v5.x

## 📊 Prometheus example

`⚠️ You need to create your own prometheus instance for this. This plugin does not do that for you!`

here is a basic example of prometheus config. In this example we assume that the metrics endpoint is not secured.

```yml
# prometheus.yaml

global:
  scrape_interval: 10s
scrape_configs:
  - job_name: "strapi"
    metrics_path: "/metrics"
    static_configs:
      - targets: ["localhost:9000"]
```

## 📊 Grafana dashboards

Here are some usefull dashboards you can start with. If you want to have your dashboard added feel free to open a PR.

- [14565](https://grafana.com/grafana/dashboards/14565)

## v1 -> v2 migration guide

A lot has changed from v1 to v2 other then strapi v5 support.

Firstly check the new configuration options those have been simplified a lot.
For starters the name has been updated a little bit to `prometheus` instead of `strapi-prometheus`
From v2 forwards a separate server that runs disconnected from strapi is the default behaviour. This can be disabled by passing `server: false` to the config.

Setting a custom registry has also been removed in favor of using the default register provided by the `prom-client` package. This allows us to create any metric at any place in our apps, instead of having to register it using this plugin. This gives you all the freedom of what to do with your custom metrics.

People using the apollo plugin will need to look into finding a new plugin to add to their apolloServer config. I recommend [this one](https://github.com/bfmatei/apollo-prometheus-exporter) as it was used as inspiration.

Some metric updates:

- apollo metrics have been deleted
- `http_request_duration_s` renamed to `http_request_duration_seconds`
- `http_{response/request}_size_bytes` renamed to `http_{response/request}_content_length_bytes`
- added `http_requests_total`
- added `http_errors_total`
- added `http_active_requests`
