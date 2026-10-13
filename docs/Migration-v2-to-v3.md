# 🏗️ Migration Guide (v2 → v3)

v3 replaces the deprecated [`prom-client`](https://www.npmjs.com/package/prom-client) with its successor, [`@prometheus-io/client`](https://github.com/prometheus/client_js). The plugin's configuration and the metrics it exposes are unchanged.

## ⚠️ Breaking Changes

- **Strapi 5.57 or later is required.** The plugin's peer dependency is now `@strapi/strapi ^5.57.0`.
- **Node.js 22 or later is required.** `@prometheus-io/client` supports Node `^22 || ^24 || >=26`. Stay on v2 if you cannot upgrade from Node 20 yet; v2 receives security fixes only.
- **Custom metrics must use `@prometheus-io/client`.** The plugin serves the default registry of `@prometheus-io/client`. Metrics you register through `prom-client` live in a different registry and no longer appear on the metrics endpoint.

## 📊 Metric Changes

With `collectDefaultMetrics` enabled, two Node.js metrics are added:

- `nodejs_eventloop_utilization_histogram`
- `nodejs_eventloop_utilization_summary`

No existing metric is renamed or removed.

## 🔄 Migration Steps

1. **Upgrade Node.js** to 22 or later and **Strapi** to 5.57 or later
2. **Update the plugin**: `npm install strapi-prometheus@3`
3. **If you register custom metrics**, switch them to the new client:

   ```bash
   npm uninstall prom-client
   npm install @prometheus-io/client
   ```

   ```js
   // Before
   const { Counter } = require('prom-client');

   // After
   const { Counter } = require('@prometheus-io/client');
   ```

4. **Check your TypeScript types** if you import them from the client: `MetricType` is now a string union (`'counter' | 'gauge' | 'histogram' | 'summary'`) instead of an enum
