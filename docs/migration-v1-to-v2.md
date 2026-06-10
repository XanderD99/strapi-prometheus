# 🏗️ Migration Guide (v1 → v2)

Version 2.0 brings significant improvements and Strapi v5 support. Here's what you need to know:

## 🔧 Configuration Changes

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
      // v2 config (see the configuration section in the README)
    }
  }
};
```

## 🚀 New Features in v2

- **Dedicated metrics server** - Default behavior for better security
- **Simplified configuration** - Easier setup and maintenance  
- **Strapi v5 support** - Future-ready compatibility
- **Enhanced metrics** - More comprehensive monitoring
- **Improved performance** - Optimized for production use

## 📊 Metric and Label Changes

| v1 Metric | v2 Metric | Change |
|-----------|-----------|---------|
| `http_request_duration_s` | `http_request_duration_seconds` | ✅ Renamed for clarity |
| `http_request_size_bytes` | `http_request_content_length_bytes` | ✅ Renamed for accuracy |
| `http_response_size_bytes` | `http_response_content_length_bytes` | ✅ Renamed for accuracy |
| Labels: `path` | Labels: `route` | ✅ More consistent route patterns |
| Apollo metrics | ❌ | 🗑️ Removed - use [apollo-prometheus-exporter](https://github.com/bfmatei/apollo-prometheus-exporter) |
| - | `http_requests_total` | ✅ New counter metric |
| - | `http_active_requests` | ✅ New gauge metric |

## 🏷️ Enhanced Label Strategy

**v2 Improvements:**

- **Smart route detection** - Uses `_matchedRoute` when available for accurate patterns
- **Consistent normalization** - `/api/articles/123` → `/api/articles/:id`
- **Low cardinality** - Prevents metric explosion from dynamic paths

## 🔄 Migration Steps

1. **Update plugin name** in your configuration
2. **Review new configuration options** (especially `server` settings)
3. **Update Prometheus scrape config** if using custom settings
4. **Update Grafana dashboards** with new metric names
5. **Test thoroughly** in development before production deployment

## ⚠️ Breaking Changes

- **Apollo metrics removed** - If you were using Apollo GraphQL metrics, you'll need to implement them separately
- **Custom registry removed** - Now uses the default `prom-client` registry (this actually gives you more flexibility!)
- **Configuration structure changed** - Follow the new configuration format

## 💡 Recommendations

- Start with default settings and customize as needed
- Use the dedicated metrics server (default behavior)
- Monitor your Prometheus targets after migration
- Consider this a good time to review your monitoring setup
