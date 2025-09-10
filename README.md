# 📊 Strapi Prometheus Plugin

[![npm downloads](https://img.shields.io/npm/dt/strapi-prometheus.svg?maxAge=3600)](https://www.npmjs.com/package/strapi-prometheus)
[![npm version](https://img.shields.io/npm/v/strapi-prometheus?maxAge=3600)](https://www.npmjs.com/package/strapi-prometheus)
[![license](https://img.shields.io/npm/l/strapi-prometheus)](https://github.com/XanderD99/strapi-prometheus/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/XanderD99/strapi-prometheus)](https://github.com/XanderD99/strapi-prometheus)

A powerful middleware plugin that adds comprehensive Prometheus metrics to your Strapi application using `prom-client` 📈. Monitor your API performance, track system resources, and gain valuable insights into your application's behavior with just a few lines of configuration! 🚀

## ✨ Features

- 🚀 **Real-time API Metrics** - Track HTTP request duration, payload sizes, and response codes with intelligent route normalization
- 📈 **System Monitoring** - Collect Node.js process metrics as recommended by [Prometheus](https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors)
- 🔒 **Secure by Default** - Dedicated metrics server (port 9000) isolated from your main application
- 🏷️ **Custom Labels** - Add custom labels to categorize and filter your metrics across environments 🌍
- 📊 **Database Lifecycle Tracking** - Monitor Strapi lifecycle events (create, update, delete) duration ⚡
- 🔌 **Easy Integration** - Simple configuration with sensible defaults - get started in minutes!
- 🆔 **Version Tracking** - Monitor Strapi version information for deployment tracking
- 🎯 **Smart Path Normalization** - Automatically converts `/api/users/123` to `/api/users/:id` for better metric cardinality
- 📦 **TypeScript Support** - Built with TypeScript for better developer experience

## ⚡ Installation

### 1. Install the package 📦

```bash
npm install strapi-prometheus
# or
yarn add strapi-prometheus
# or
pnpm add strapi-prometheus
```

### 2. Install peer dependencies 🔧

```bash
npm install prom-client
# or
yarn add prom-client
# or
pnpm add prom-client
```

### 3. Configure the plugin ⚙️

Create or update your `config/plugins.js` (or `config/plugins.ts` for TypeScript):

```js
// config/plugins.js
module.exports = {
  // ...other plugins
  prometheus: {
    enabled: true,
    config: {
      // Optional: Collect Node.js default metrics
      // See collectDefaultMetricsOption of prom-client for all options
      collectDefaultMetrics: false, // or { prefix: 'my_app_' }
      
      // Optional: Add custom labels to all metrics
      labels: { 
        app: "my-strapi-app",
        environment: "production"
      },
      
      // Server configuration
      // Set to false to expose metrics on your main Strapi server (not recommended)
      server: {
        port: 9000,           // Metrics server port
        host: '0.0.0.0',      // Metrics server host
        path: '/metrics'      // Metrics endpoint path
      }
      // OR disable separate server (use with caution):
      // server: false
    }
  }
};
```

For TypeScript projects:

```ts
// config/plugins.ts
export default {
  prometheus: {
    enabled: true,
    config: {
      collectDefaultMetrics: false,
      labels: { 
        app: "my-strapi-app",
        environment: process.env.NODE_ENV || "development"
      },
      server: {
        port: parseInt(process.env.METRICS_PORT || '9000'),
        host: process.env.METRICS_HOST || '0.0.0.0',
        path: '/metrics'
      }
    }
  }
};
```

## 📊 Available Metrics

The plugin automatically collects the following metrics with intelligent route pattern detection ✨:

| Metric Name | Description | Type | Labels |
|-------------|-------------|------|--------|
| `http_request_duration_seconds` | Duration of HTTP requests in seconds ⏱️ | Histogram | `origin`, `method`, `route`, `status` |
| `http_request_content_length_bytes` | Size of request payloads in bytes 📤 | Histogram | `origin`, `method`, `route`, `status` |
| `http_response_content_length_bytes` | Size of response payloads in bytes 📥 | Histogram | `origin`, `method`, `route`, `status` |
| `strapi_version_info` | Strapi version information 🏷️ | Gauge | `version` |
| `lifecycle_duration_seconds` | Duration of Strapi database lifecycle events 💾 | Histogram | `event` |

### Optional System Metrics

When `collectDefaultMetrics` is enabled, you'll also get Node.js process metrics:

- `process_cpu_user_seconds_total` - CPU time spent in user mode
- `process_cpu_system_seconds_total` - CPU time spent in system mode  
- `process_start_time_seconds` - Process start time
- `process_resident_memory_bytes` - Resident memory size
- `nodejs_heap_size_total_bytes` - Total heap size
- `nodejs_heap_size_used_bytes` - Used heap size
- `nodejs_external_memory_bytes` - External memory usage
- And more...

## 🚀 Quick Start

1. 📦 Install and configure the plugin (see [Installation](#-installation))
2. 🎬 Start your Strapi application
3. 📊 Metrics will be available at `http://localhost:9000/metrics`
4. 🔗 Configure Prometheus to scrape this endpoint

## 📊 Accessing Metrics

### Dedicated Server (Default & Recommended)

By default, metrics are served on a separate server:

```bash
curl http://localhost:9000/metrics
```

### Main Strapi Server (Not Recommended)

If you set `server: false`, metrics will be available on your main Strapi server:

```bash
# Requires authentication token
curl -H "Authorization: Bearer YOUR_API_TOKEN" http://localhost:1337/api/metrics
```

## 👮‍♀️ Security Considerations

> [!CAUTION]
> Metrics can contain sensitive information about your application's usage patterns, performance characteristics, and potentially user behavior. Always secure your metrics endpoint appropriately.

### Recommended: Dedicated Server (Default)

The plugin starts a separate server on port 9000 by default, isolated from your main application:

- ✅ **Secure by design** - No external access to your main application
- ✅ **Simple firewall rules** - Block port 9000 from external access
- ✅ **Performance** - No impact on your main application
- ✅ **Monitoring-specific** - Dedicated to metrics collection

### Alternative: Main Server Integration

You can expose metrics on your main Strapi server by setting `server: false`:

- ⚠️ **Authentication required** - Protected by Strapi's auth middleware
- ⚠️ **API token needed** - Must create and manage API tokens
- ⚠️ **Potential exposure** - Metrics endpoint on your main application
- ⚠️ **Performance impact** - Additional load on main server

**We strongly recommend using the dedicated server approach.**

## 🤝 Compatibility

| Strapi Version | Plugin Version | Status |
|---------------|----------------|---------|
| v5.x | v2.x.x | ✅ Fully Supported ⭐ |
| v4.x | v1.x.x | ❌ EOL 🔧 |

> **Note**: For new projects, we recommend using Strapi v5.x with the latest plugin version! 🎯

## 📊 Grafana Dashboards

Ready-to-use Grafana dashboards for visualizing your Strapi metrics:

### Official Dashboards

- **[Dashboard 14565](https://grafana.com/grafana/dashboards/14565)** - Comprehensive Strapi monitoring dashboard

### Contributing Dashboards

Have a great dashboard? We'd love to feature it! Please [open a pull request](https://github.com/XanderD99/strapi-prometheus) with your dashboard JSON. 🎨

## 🔍 Troubleshooting

### Common Issues

#### Metrics server not starting

- Check if port 9000 is already in use
- Verify firewall settings
- Check Strapi logs for error messages

#### No metrics appearing

- Ensure the plugin is properly enabled in `config/plugins.js`
- Verify that `prom-client` is installed
- Check that requests are being made to your Strapi application

#### Memory usage increasing

- Consider disabling `collectDefaultMetrics` if not needed
- Review custom labels - avoid high-cardinality labels
- Monitor Prometheus scrape interval

### 🆘 Getting Help

- 🐛 [Report bugs](https://github.com/XanderD99/strapi-prometheus/issues)
- 💡 [Request features](https://github.com/XanderD99/strapi-prometheus/issues)
- 📖 [Read the documentation](https://github.com/XanderD99/strapi-prometheus)
- ☕ [Buy me a coffee](https://www.buymeacoffee.com/xanderd)

## 🏗️ v1 → v2 Migration Guide

## 🏗️ Migration Guide (v1 → v2)

Version 2.0 brings significant improvements and Strapi v5 support. Here's what you need to know:

### 🔧 Configuration Changes

**Old (v1):**

```js
module.exports = {
  'strapi-prometheus': {
    enabled: true,
    config: {
      // v1 config
    }
  }
};
```

**New (v2):**

```js
module.exports = {
  prometheus: {  // ← Plugin name simplified
    enabled: true,
    config: {
      // v2 config (see configuration section above)
    }
  }
};
```

### 🚀 New Features in v2

- **Dedicated metrics server** - Default behavior for better security
- **Simplified configuration** - Easier setup and maintenance  
- **Strapi v5 support** - Future-ready compatibility
- **Enhanced metrics** - More comprehensive monitoring
- **Improved performance** - Optimized for production use

### 📊 Metric and Label Changes

| v1 Metric | v2 Metric | Change |
|-----------|-----------|---------|
| `http_request_duration_s` | `http_request_duration_seconds` | ✅ Renamed for clarity |
| `http_request_size_bytes` | `http_request_content_length_bytes` | ✅ Renamed for accuracy |
| `http_response_size_bytes` | `http_response_content_length_bytes` | ✅ Renamed for accuracy |
| Labels: `path` | Labels: `route` | ✅ More consistent route patterns |
| Apollo metrics | ❌ | 🗑️ Removed - use [apollo-prometheus-exporter](https://github.com/bfmatei/apollo-prometheus-exporter) |
| - | `http_requests_total` | ✅ New counter metric |
| - | `http_active_requests` | ✅ New gauge metric |

### 🏷️ Enhanced Label Strategy

**v2 Improvements:**

- **Smart route detection** - Uses `_matchedRoute` when available for accurate patterns
- **Consistent normalization** - `/api/articles/123` → `/api/articles/:id`
- **Low cardinality** - Prevents metric explosion from dynamic paths
- **Added `origin` label** - Track requests by source

### 🔄 Migration Steps

1. **Update plugin name** in your configuration
2. **Review new configuration options** (especially `server` settings)
3. **Update Prometheus scrape config** if using custom settings
4. **Update Grafana dashboards** with new metric names
5. **Test thoroughly** in development before production deployment

### ⚠️ Breaking Changes

- **Apollo metrics removed** - If you were using Apollo GraphQL metrics, you'll need to implement them separately
- **Custom registry removed** - Now uses the default `prom-client` registry (this actually gives you more flexibility!)
- **Configuration structure changed** - Follow the new configuration format

### 💡 Recommendations

- Start with default settings and customize as needed
- Use the dedicated metrics server (default behavior)
- Monitor your Prometheus targets after migration
- Consider this a good time to review your monitoring setup

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Reporting Issues

- Use the [issue tracker](https://github.com/XanderD99/strapi-prometheus/issues) 📝
- Search existing issues before creating new ones 🔍
- Provide clear reproduction steps 📋
- Include environment details (Strapi version, Node.js version, OS) 💻

### 💻 Development

1. Fork the repository 🍴
2. Create a feature branch: `git checkout -b feature/amazing-feature` 🌿
3. Make your changes ✨
4. Add tests if applicable 🧪
5. Commit with clear messages: `git commit -m 'Add amazing feature'` 💬
6. Push to your branch: `git push origin feature/amazing-feature` 🚀
7. Open a Pull Request 🔄

### 📝 Documentation

- Improve README documentation 📖
- Add code examples 💡
- Create tutorials or blog posts ✍️
- Share Grafana dashboards 📊

## 📜 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 👨‍💻 Author & Maintainer

**Xander Denecker** ([@XanderD99](https://github.com/XanderD99))

- 🐙 GitHub: [XanderD99](https://github.com/XanderD99)
- ☕ Buy me a coffee: [buymeacoffee.com/xanderd](https://www.buymeacoffee.com/xanderd)

## 🙏 Acknowledgments

- [Prometheus](https://prometheus.io/) - The monitoring system that makes this all possible
- [prom-client](https://github.com/siimon/prom-client) - The Node.js Prometheus client library
- [Strapi](https://strapi.io/) - The leading open-source headless CMS
- All [contributors](https://github.com/XanderD99/strapi-prometheus/contributors) who have helped improve this plugin

---

**⭐ If this plugin helps you, please consider giving it a star on [GitHub](https://github.com/XanderD99/strapi-prometheus)!**
