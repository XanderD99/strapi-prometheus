# 👮‍♀️ Security Policy

## Supported Versions

| Strapi Version | Plugin Version | Supported |
| -------------- | -------------- | --------- |
| v5.x           | v2.x.x         | ✅        |
| v4.x           | v1.x.x         | ❌ EOL    |

## Reporting a Vulnerability

Please **do not** open a public issue for security vulnerabilities. Report them privately through [GitHub Security Advisories](https://github.com/XanderD99/strapi-prometheus/security/advisories/new) instead.

## Securing the Metrics Endpoint

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
route is mounted on the content-api at `/api/metrics`:

- ⚠️ **Not authenticated by the plugin** - Do NOT grant the `metrics.find` permission to the Public role, or your metrics become world-readable without a token
- ⚠️ **Use an API key/token** - Protect the endpoint with a Strapi API token and restrict access at the network layer where possible
- ⚠️ **Potential exposure** - Metrics endpoint shares the main application's surface
- ⚠️ **Performance impact** - Additional load on the main server

**We recommend keeping the dedicated server bound to `127.0.0.1` (the default) and exposing it only through one of the network-layer options above.**
