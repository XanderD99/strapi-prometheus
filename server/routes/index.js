module.exports = {
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/',
        handler: 'prometheus.metrics',
      },
    ]
  }
}
