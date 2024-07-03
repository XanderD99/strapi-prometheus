module.exports = class MetricServer {
    app;
    server;
    options;
  
    constructor(options, register, logger) {
        console.log(options)
        const express = require('express');
        this.options = options;
        this.app = express().get(options.path, async (_, response) => {
            try {
                const json = await register.metrics()
                response.setHeader('Content-Type', 'text/plain').status(200).send(json)
            } catch (error) {
                response.status(500).send(error)
            } finally {
                response.end()
            }
        });

        this.server = this.app.listen(this.options.port, this.options.host, () => {
            logger.info(`Metrics exposed on ${this.options.host}:${this.options.port}${this.options.path || '/metrics'}`);
        });
    }

    stop() {
      this.server?.close();
    }
  }
  