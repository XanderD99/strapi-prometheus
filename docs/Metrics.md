# 📊 Metrics

## Available Metrics

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

## Accessing Metrics

### Dedicated Server (Default & Recommended)

By default, metrics are served on a separate server:

```bash
curl http://localhost:9000/metrics
```

### Main Strapi Server (Not Recommended)

If you set `server: false`, metrics are mounted on your main Strapi server's
content-api at `/api/metrics`:

```bash
# Requires an API token
curl -H "Authorization: Bearer YOUR_API_TOKEN" http://localhost:1337/api/metrics
```

> [!WARNING]
> The `/api/metrics` route is **not** authenticated by the plugin. **Do NOT grant
> the `metrics.find` permission to the Public role** — doing so makes the full
> Prometheus exposition world-readable without a token. Always protect it with an
> API key/token (and restrict access at the network layer where possible). The
> plugin logs this warning at startup when `server: false`.

To let a Prometheus server on another host scrape the endpoint safely, see [Exposing metrics to a scraper](https://github.com/XanderD99/strapi-prometheus/blob/main/.github/SECURITY.md#exposing-metrics-to-a-scraper).
