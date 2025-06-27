---
name: 🐛 Bug Report
about: Report a bug to help us improve the Strapi Prometheus plugin
title: '[BUG] '
labels: 'bug'
assignees: 'XanderD99'

---

## 🐛 Bug Description
<!-- A clear and concise description of what the bug is -->

## 🔄 Steps to Reproduce
<!-- Steps to reproduce the behavior -->

1. Step one
2. Step two  
3. Step three
4. Step four 

## ✅ Expected Behavior
<!-- A clear and concise description of what you expected to happen -->

## ❌ Actual Behavior
<!-- A clear and concise description of what actually happened -->

## 📱 Environment Information
<!-- Please complete the following information -->

**Strapi Information:**

- Strapi Version: [e.g. 5.0.0]
- Plugin Version: [e.g. 2.2.2]
- Installation Method: [e.g. npm, yarn, pnpm]

**System Information:**

- OS: [e.g. macOS 13.0, Ubuntu 22.04, Windows 11]
- Node.js Version: [e.g. 18.17.0]
- Package Manager: [e.g. npm 9.0.0, yarn 3.6.0]

**Prometheus Setup:**

- Prometheus Version: [e.g. 2.45.0]
- Metrics Server: [e.g. dedicated server on port 9000, main Strapi server]
- Default Metrics Enabled: [e.g. yes/no]

## 📊 Configuration
<!-- Share your plugin configuration (remove sensitive data) -->
```js
// config/plugins.js or config/plugins.ts
prometheus: {
  enabled: true,
  config: {
    // Your configuration here
  }
}
```

## 📋 Logs/Error Messages
<!-- If applicable, add error messages or relevant log outputs -->

```text
Paste error messages or logs here
```

## 📸 Screenshots
<!-- If applicable, add screenshots to help explain your problem -->

## 🔍 Additional Context
<!-- Add any other context about the problem here -->
- Are you using any other Strapi plugins that might conflict?
- Have you tried with a fresh Strapi installation?
- Any custom middleware or modifications?

## ✅ Checklist
<!-- Please check the boxes that apply -->
- [ ] I have searched existing issues to ensure this is not a duplicate
- [ ] I have provided all the requested information above
- [ ] I have tested this with the latest version of the plugin
- [ ] I have checked the [troubleshooting guide](https://github.com/XanderD99/strapi-prometheus#-troubleshooting) in the README
