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

### 3. Enable the plugin ⚙️

```js
// config/plugins.js
module.exports = {
  prometheus: {
    enabled: true,
  },
};
```

Start Strapi and metrics are served at `http://127.0.0.1:9000/metrics` 📊. See [Configuration](docs/Configuration.md) for custom labels, server settings, and path normalization.

> [!CAUTION]
> The metrics endpoint is **not authenticated**. Read the [security policy](.github/SECURITY.md) before exposing it beyond localhost.

## 🤝 Compatibility

| Strapi Version | Plugin Version | Status                |
| -------------- | -------------- | --------------------- |
| v5.x           | v2.x.x         | ✅ Fully Supported ⭐ |
| v4.x           | v1.x.x         | ❌ EOL 🔧             |

Upgrading from v1? See the [Migration Guide (v1 → v2)](docs/Migration-v1-to-v2.md).

## 📖 Documentation

- [Configuration](docs/Configuration.md)
- [Metrics](docs/Metrics.md)
- [Path Normalization](docs/Path-Normalization.md)
- [Grafana Dashboards](docs/Grafana-Dashboards.md)
- [Troubleshooting](docs/Troubleshooting.md)
- [Security](.github/SECURITY.md) · [Contributing](.github/CONTRIBUTING.md) · [Support](.github/SUPPORT.md)

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
