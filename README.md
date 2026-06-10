# 📊 Strapi Prometheus Plugin

[![npm downloads](https://img.shields.io/npm/dt/strapi-prometheus.svg?maxAge=3600)](https://www.npmjs.com/package/strapi-prometheus)
[![npm version](https://img.shields.io/npm/v/strapi-prometheus?maxAge=3600)](https://www.npmjs.com/package/strapi-prometheus)
[![license](https://img.shields.io/npm/l/strapi-prometheus)](https://github.com/XanderD99/strapi-prometheus/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/XanderD99/strapi-prometheus)](https://github.com/XanderD99/strapi-prometheus)

A powerful middleware plugin that adds comprehensive Prometheus metrics to your Strapi application using `prom-client` 📈. Monitor your API performance, track system resources, and gain valuable insights into your application's behavior with just a few lines of configuration! 🚀

## ✨ Features

- 🚀 **Real-time API Metrics** - Track HTTP request duration, payload sizes, and response codes with intelligent route normalization
- 📈 **System Monitoring** - Collect Node.js process metrics as recommended by [Prometheus](https://prometheus.io/docs/instrumenting/writing_clientlibs/#standard-and-runtime-collectors)
- 🔒 **Private by Default** - Dedicated metrics server binds to `127.0.0.1:9000`, isolated from your main application and not reachable from outside the host until you opt in
- 🏷️ **Custom Labels** - Add custom labels to categorize and filter your metrics across environments 🌍
- 📊 **Database Lifecycle Tracking** - Monitor Strapi lifecycle events (create, update, delete) duration ⚡
- 🔌 **Easy Integration** - Simple configuration with sensible defaults - get started in minutes!
- 🆔 **Version Tracking** - Monitor Strapi version information for deployment tracking
- 🎯 **Smart Path Normalization** - Flexible normalization with regex patterns or custom functions to group similar routes for better metric cardinality 📊
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
        host: '127.0.0.1',    // Metrics server host (bind to 0.0.0.0 only if access is restricted at the network layer)
        path: '/metrics'      // Metrics endpoint path
      },
      // OR disable separate server (use with caution):
      // server: false
      
      // 🎯 Path Normalization Rules
      normalize: [
        [/\/(?:[a-z0-9]{24,25}|\d+)(?=\/|$)/, '/:id'], // Document IDs or numeric IDs
        [/\/uploads\/[^\/]+\.[a-zA-Z0-9]+/, '/uploads/:file'], // Uploaded files with extensions
      ]
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
        host: process.env.METRICS_HOST || '127.0.0.1',
        path: '/metrics'
      },
      
      // Custom normalization function (alternative to array rules)
      normalize: (ctx) => {
        let path = ctx.path;
        
        // Custom logic for your specific needs
        if (path.startsWith('/api/')) {
          path = path.replace(/\/\d+/g, '/:id'); // Replace numeric IDs
        }
        
        return path;
      }
    }
  }
};
```

## 📊 Available Metrics

The plugin automatically collects the following metrics with intelligent route pattern detection ✨:

| Metric Name | Description | Type | Labels |
|-------------|-------------|------|--------|
| `http_request_duration_seconds` | Duration of HTTP requests in seconds ⏱️ | Histogram | `method`, `route`, `status` |
| `http_request_content_length_bytes` | Size of request payloads in bytes 📤 | Histogram | `method`, `route`, `status` |
| `http_response_content_length_bytes` | Size of response payloads in bytes 📥 | Histogram | `method`, `route`, `status` |
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

## 🎯 Smart Path Normalization

The plugin features intelligent path normalization to ensure optimal metric cardinality by grouping similar routes together ✨

### 📝 Configuration Options

You can configure path normalization in two ways:

#### 1. **Array of Regex Rules** (Recommended)

Use an array of `[RegExp, replacement]` tuples to define normalization patterns:

```js
normalize: [
  [/\/(?:[a-z0-9]{24,25}|\d+)(?=\/|$)/, '/:id'], // Document IDs or numeric IDs
  [/\/uploads\/[^\/]+\.[a-zA-Z0-9]+/, '/uploads/:file'], // Uploaded files with extensions
  
  // Custom patterns
  [/\/users\/\d+/, '/users/:id'],                                   // /users/123
  [/\/orders\/ORD\d+/, '/orders/:orderCode']                        // /orders/ORD12345
]
```

#### 2. **Custom Function**

Use a function for dynamic normalization logic:

```js
normalize: (ctx) => {
  let path = ctx.path;
  
  // Custom normalization logic
  if (path.startsWith('/api/')) {
    path = path.replace(/\/\d+/g, '/:id');           // Replace numeric IDs
    path = path.replace(/\/[a-f0-9-]{36}/gi, '/:uuid'); // Replace UUIDs
  }
  
  // Multi-tenant example
  if (path.startsWith('/tenant/')) {
    path = path.replace(/^\/tenant\/[^\/]+/, '/tenant/:id');
  }
  
  return path;
}
```

### 🏷️ Built-in Patterns

The plugin includes pre-configured patterns for common Strapi routes:

| Original Path | Normalized Path | Description |
|--------------|----------------|-------------|
| `/api/posts/123` | `/api/posts/:id` | API resource with ID |
| `/api/posts/123/comments/456` | `/api/posts/:id/comments/:id` | Nested resources |
| `/admin/content-manager/collection-types/api::post.post/123` | `/admin/content-manager/:type/:contentType/:id` | Admin content manager |
| `/uploads/image.jpg` | `/uploads/:file` | File uploads |
| `/en/api/posts/123` | `/:locale/api/posts/:id` | i18n localized routes |
| `/fr-FR/dashboard` | `/:locale/dashboard` | Locale-specific pages |

### 🚀 Benefits

- ✅ **Low Cardinality** - Groups similar routes to prevent metric explosion
- ✅ **Prometheus-Friendly** - Follows Prometheus best practices
- ✅ **Flexible** - Support both regex patterns and custom functions  
- ✅ **Performance** - Efficient pattern matching with minimal overhead
- ✅ **Strapi-Aware** - Built-in knowledge of Strapi routing conventions

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

If you set `server: false`, metrics are mounted on your main Strapi server as an
**admin** route at `/prometheus/metrics`, guarded by the `admin::isAuthenticatedAdmin`
policy. This means a request must carry a valid admin session token — it cannot be
exposed to unauthenticated clients (or content-api API tokens), even by accident:

```bash
# Requires an authenticated admin session token (not a content-api API token)
curl -H "Authorization: Bearer YOUR_ADMIN_JWT" http://localhost:1337/prometheus/metrics
```

## 👮‍♀️ Security Considerations

> [!CAUTION]
> The metrics endpoint is **not authenticated**. Anyone who can reach it receives the full Prometheus exposition. Prometheus metrics can reveal sensitive operational detail about your application — exact Strapi version and patch level, your content-type/model names (via `lifecycle_duration_seconds`), internal route paths, request volume and error rates (including failed-login counts on `/api/auth/local`), and process/runtime telemetry such as memory usage, open file descriptors, and event-loop lag. This information is valuable for fingerprinting and planning targeted attacks, so the endpoint must never be exposed to untrusted networks.

### Default: bound to localhost

By default the plugin starts a dedicated metrics server bound to `127.0.0.1:9000`. This keeps the endpoint reachable only from the host itself (and from other containers sharing the same network namespace), so a default install is **not** exposed to your network or the public internet.

> [!IMPORTANT]
> A separate port is **not** a security boundary on its own. If you bind the metrics server to `0.0.0.0` (all interfaces), publish the port from a Docker container (`-p 9000:9000`), or expose it through a Kubernetes `Service`/`LoadBalancer`, the endpoint becomes reachable by anyone who can route to it — there is no built-in authentication to stop them. The plugin logs a startup warning when `host` is set to `0.0.0.0`.

### Exposing metrics to a scraper

Prometheus usually needs to scrape from another host, so you will often need to make the endpoint reachable beyond `127.0.0.1`. Do this at the network layer rather than opening it to the world:

**Option A — keep it on localhost and scrape locally.** Run a Prometheus agent / node-exporter sidecar on the same host (or in the same Kubernetes pod) and let it scrape `127.0.0.1:9000`. This is the simplest and safest setup.

**Option B — bind to a private interface and firewall it.** Bind to a specific internal address and restrict access to your monitoring network:

```js
server: {
  port: 9000,
  host: '10.0.0.5',   // private/internal interface only — never a public IP
  path: '/metrics'
}
```

```bash
# Example: only allow your Prometheus host to reach port 9000 (Linux, ufw)
ufw allow from 10.0.0.10 to any port 9000 proto tcp
ufw deny 9000
```

**Option C — put it behind a reverse proxy that enforces auth.** Bind to `127.0.0.1` and let nginx (or Traefik, Caddy, etc.) terminate TLS and require a credential before forwarding:

```nginx
location /metrics {
    auth_basic           "metrics";
    auth_basic_user_file /etc/nginx/.htpasswd;   # or mTLS / an allow-list
    proxy_pass           http://127.0.0.1:9000/metrics;
}
```

**Docker / Kubernetes note:** do not publish port 9000 to the host (`-p 9000:9000`) or expose it via a public `Service`/`LoadBalancer`. Keep it on an internal network and scrape it from within the cluster.

### Alternative: Main Server Integration

You can expose metrics on your main Strapi server by setting `server: false`. The
route is mounted as an **admin** route at `/prometheus/metrics`, guarded by the
`admin::isAuthenticatedAdmin` policy:

- ✅ **Admin authentication enforced in code** - Requires a valid admin session token; a content-api permission mis-grant cannot expose it
- ⚠️ **Admin token needed** - Scrapers must present an admin JWT (Prometheus cannot use a static content-api API token)
- ⚠️ **Potential exposure** - Metrics endpoint shares the main application's surface
- ⚠️ **Performance impact** - Additional load on the main server

**We recommend keeping the dedicated server bound to `127.0.0.1` (the default) and exposing it only through one of the network-layer options above.**

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
