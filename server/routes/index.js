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
          auth: {
            scope: ['find']
          }
        }
      },
      {
        method: 'GET',
        path: '/metrics/:name',
        handler: 'prometheus.findOne',
        config: {
          prefix: '',
          auth: {
            scope: ['findOne']
          }
        }
      },
    ]
  }
}
