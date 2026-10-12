# 🎯 Smart Path Normalization

The plugin features intelligent path normalization to ensure optimal metric cardinality by grouping similar routes together ✨

## 📝 Configuration Options

You can configure path normalization in two ways:

### 1. **Array of Regex Rules** (Recommended)

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

### 2. **Custom Function**

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

## 🏷️ Built-in Patterns

The plugin includes pre-configured patterns for common Strapi routes:

| Original Path | Normalized Path | Description |
|--------------|----------------|-------------|
| `/api/posts/123` | `/api/posts/:id` | API resource with ID |
| `/api/posts/123/comments/456` | `/api/posts/:id/comments/:id` | Nested resources |
| `/admin/content-manager/collection-types/api::post.post/123` | `/admin/content-manager/:type/:contentType/:id` | Admin content manager |
| `/uploads/image.jpg` | `/uploads/:file` | File uploads |
| `/en/api/posts/123` | `/:locale/api/posts/:id` | i18n localized routes |
| `/fr-FR/dashboard` | `/:locale/dashboard` | Locale-specific pages |

## 🚀 Benefits

- ✅ **Low Cardinality** - Groups similar routes to prevent metric explosion
- ✅ **Prometheus-Friendly** - Follows Prometheus best practices
- ✅ **Flexible** - Support both regex patterns and custom functions  
- ✅ **Performance** - Efficient pattern matching with minimal overhead
- ✅ **Strapi-Aware** - Built-in knowledge of Strapi routing conventions
