# ⚙️ Configuration

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

See [Path Normalization](Path-Normalization) for the `normalize` option, and the [security policy](https://github.com/XanderD99/strapi-prometheus/blob/main/.github/SECURITY.md) before changing `server.host` or setting `server: false`.
