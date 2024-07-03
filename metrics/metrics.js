const http = require('http');

module.exports =  class MetricsServer {
  constructor(options, register, logger) {
    this.logger = logger;

    this.server = http.createServer(async (req, res) => {
        if (req.method === 'GET' && req.url === options.path) {
          // Replace this with your logic to generate metrics data
          const data = await register.metrics()
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data);
        } else {
          res.statusCode = 404;
          res.end('Not Found');
        }
      });
  
      this.server.listen(options.port, options.host, () => {
        logger.debug(`Serving metrics on http://${options.host}:${options.port}${options.path}`);
      });
  
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        this.logger.warn('Metrics server stopped.');
      });
      this.server = null;
    }
  }
}