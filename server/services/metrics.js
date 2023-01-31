const { Gauge, Histogram, Counter } = require('prom-client');
const { plugin_id } = require('../utils')

exports.metricNames = {
  koa: {
    openConnections: 'number_of_open_connections'
  },
  HTTP: {
    requestDuration: 'http_request_duration_ms',
    requestSize: 'http_request_size_bytes',
    responseSize: 'http_response_size_bytes'
  },
  apollo: {
    server: 'apollo_server',
    query: {
      duration: 'apollo_query_duration_ms',
      parsed: 'apollo_query_parsed',
      validation: 'apollo_query_validation',
      resolved: 'apollo_query_resolved',
      executed: 'apollo_query_executed',
      fieldDuration: 'apollo_query_field_resolution_duration_ms'
    },
  }
}

exports.koaMetrics = [
  {
    name: this.metricNames.koa.openConnections,
    help: 'number of open connection to the koa.js server',
    type: Gauge
  }
]

const httpLabelNames = ['method', 'path', 'status'];
exports.httpMetrics = [
  {
    name: this.metricNames.HTTP.requestDuration,
    help: 'Duration of HTTP requests in miliseconds',
    labelNames: httpLabelNames,
    buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5],
    type: Histogram
  },
  {
    name: this.metricNames.HTTP.requestSize,
    help: 'Size of HTTP requests in bytes',
    labelNames: httpLabelNames,
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    type: Histogram
  },
  {
    name: this.metricNames.HTTP.responseSize,
    help: 'Size of HTTP respone in bytes',
    labelNames: httpLabelNames,
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    type: Histogram
  }
]

const serverLabelNames = ['status']
const queryLabelNames = ['operationName', 'operation', 'status'];
const fieldLabelNames = ['operationName', 'operation', 'fieldName', 'parentType', 'returnType', 'pathLength', 'status'];
exports.apolloMetrics = [
  {
    name: this.metricNames.apollo.server,
    help: 'The last timestamp when Apollo Server state (start|stop) was changed.',
    labelNames: serverLabelNames,
    type: Gauge,
  },
  {
    name: this.metricNames.apollo.query.duration,
    help: 'duration in seconds of a query',
    type: Histogram,
    labelNames: queryLabelNames,
    buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5]
  },
  {
    name: this.metricNames.apollo.query.parsed,
    help: 'The amount of queries parsed.',
    type: Counter,
    labelNames: queryLabelNames
  },
  {
    name: this.metricNames.apollo.query.validation,
    help: 'The amount of queries validated.',
    type: Counter,
    labelNames: queryLabelNames
  },
  {
    name: this.metricNames.apollo.query.resolved,
    help: 'The amount of queries resolved.',
    type: Counter,
    labelNames: queryLabelNames
  },
  {
    name: this.metricNames.apollo.query.executed,
    help: 'The amount of queries executed.',
    type: Counter,
    labelNames: queryLabelNames
  },
  {
    name: this.metricNames.apollo.query.fieldDuration,
    help: 'The total duration in seconds for resolving fields.',
    type: Histogram,
    labelNames: fieldLabelNames,
    buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5]
  }
]

exports.service = function () {
  const metrics = new Map();

  const { service } = strapi.plugin(plugin_id);

  const register = service('registry');

  return {
    get(name) {
      return name ? metrics.get(name) : Array.from(metrics.values())
    },
    register(metric) {
      if (Array.isArray(metric)) {
        return metric.forEach(this.register.bind(this))
      }

      if (metrics.has(metric.name)) {
        return strapi.log.error(metric.name, 'already exists')
      }

      const options = {
        name: `${metric.name}`,
        help: metric.help,
        buckets: metric.buckets || [],
        labelNames: metric.labelNames || [],
        registers: [register]
      }

      metrics.set(metric.name, new metric.type(options))
    }
  }
}
