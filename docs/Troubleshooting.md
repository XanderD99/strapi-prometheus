# 🔍 Troubleshooting

## Common Issues

### Metrics server not starting

- Check if port 9000 is already in use
- Verify firewall settings
- Check Strapi logs for error messages

### No metrics appearing

- Ensure the plugin is properly enabled in `config/plugins.js`
- Check that requests are being made to your Strapi application

### Memory usage increasing

- Consider disabling `collectDefaultMetrics` if not needed
- Review custom labels - avoid high-cardinality labels
- Monitor Prometheus scrape interval

## 🆘 Getting Help

See [SUPPORT.md](https://github.com/XanderD99/strapi-prometheus/blob/main/.github/SUPPORT.md).
