module.exports = {
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/',
        handler: 'metrics.metrics',
      },
    ]
  }
}
