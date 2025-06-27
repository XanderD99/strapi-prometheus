---
name: 🐌 Performance Issue
about: Report performance problems or memory leaks
title: '[PERFORMANCE] '
labels: 'performance, bug'
assignees: 'XanderD99'

---

## 🐌 Performance Issue Description
<!-- Describe the performance problem you're experiencing -->

## 📊 Performance Metrics
<!-- Share any performance data you have -->

**Before Plugin:**

- Memory Usage: [e.g. 150MB]
- CPU Usage: [e.g. 5%]
- Response Time: [e.g. 50ms]

**After Plugin:**

- Memory Usage: [e.g. 300MB]
- CPU Usage: [e.g. 15%]
- Response Time: [e.g. 200ms]

## 🔧 Configuration
<!-- Share your plugin configuration -->

```js
prometheus: {
  enabled: true,
  config: {
    collectDefaultMetrics: true, // or false
    labels: {
      // your labels
    },
    server: {
      // your server config
    }
  }
}
```

## 📈 Load Characteristics
<!-- Describe your application's load -->

- **Requests per minute:** [e.g. 1000]
- **Concurrent users:** [e.g. 50]
- **Data volume:** [e.g. 10GB database]
- **Number of API endpoints:** [e.g. 25]

## 📱 Environment Information

**Strapi Information:**

- Strapi Version: [e.g. 5.0.0]
- Plugin Version: [e.g. 2.2.2]
- Other plugins: [list other plugins that might interact]

**System Information:**

- OS: [e.g. Ubuntu 22.04]
- Node.js Version: [e.g. 18.17.0]
- Memory: [e.g. 4GB RAM]
- CPU: [e.g. 2 cores, 2.4GHz]

**Deployment:**

- Environment: [e.g. Docker, bare metal, cloud]
- Database: [e.g. PostgreSQL 14]
- Prometheus scrape interval: [e.g. 15s]

## 🔍 Monitoring Data
<!-- If you have monitoring data, share relevant charts or numbers -->

## 💡 Expected Performance
<!-- What performance characteristics were you expecting? -->

## 🔄 Steps to Reproduce
<!-- How can we reproduce this performance issue? -->

1. Step one
2. Step two
3. Step three

## 🛠️ Attempted Solutions
<!-- What have you tried to resolve this? -->

- [ ] Disabled `collectDefaultMetrics`
- [ ] Reduced custom labels
- [ ] Increased Prometheus scrape interval
- [ ] Monitored memory usage over time
- [ ] Profiled the application

## ✅ Checklist

- [ ] I have confirmed this is related to the Prometheus plugin
- [ ] I have performance data to support this issue
- [ ] I have tested with the plugin disabled for comparison
- [ ] I have checked for memory leaks over extended periods
