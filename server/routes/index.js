module.exports = {
  'content-api': {
    type: 'content-api',
    routes: [
      {
        method: 'GET',
        path: '/metrics',
        handler: 'prometheus.find',
        config: {
          prefix: '',
        }
      },
      {
        method: 'GET',
        path: '/metrics/:name',
        handler: 'prometheus.findOne',
        config: {
          prefix: '',
        }
      },
    ]
  }
}
