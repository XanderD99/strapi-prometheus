const { metricNames } = require("../server/services/metrics");
const { plugin_id } = require("../server/utils");

function filterLabels(labels) {
  return Object.fromEntries(Object.entries(labels).filter(([_label, value]) => value !== undefined && value !== null));
}

function getLabelsFromContext(context) {
  return filterLabels({
    operationName: context?.operationName,
    operation: context?.operation?.operation
  });
}

function countFieldAncestors(path) {
  let counter = 0;

  while (path !== undefined) {
    path = path.prev;
    counter++;
  }

  return counter.toString();
}

function getLabelsFromFieldResolver({ info: { fieldName, parentType, path, returnType } }) {
  return {
    fieldName,
    parentType: parentType.name,
    pathLength: countFieldAncestors(path),
    returnType: returnType.toString()
  };
}

module.exports = {
  async serverWillStart() {
    const { service } = strapi.plugin(plugin_id)
    service('metrics').get(metricNames.apollo.server)?.labels('start').set(Date.now())

    return {
      async serverWillStop() {
        service('metrics').get(metricNames.apollo.server)?.labels('stop').set(Date.now())
      }
    };
  },
  async requestDidStart(requestContext) {
    const { service } = strapi.plugin(plugin_id)
    const requestEnd = service('metrics').get(metricNames.apollo.query.duration)?.startTimer()

    return {
      async parsingDidStart(context) {
        const labels = getLabelsFromContext(context);

        return (error) => {
          const status = error ? 'failed' : 'success'
          service('metrics').get(metricNames.apollo.query.parsed)?.labels({ ...labels, status }).inc()
        }
      },
      async validationDidStart(context) {
        const labels = getLabelsFromContext(context);

        return (error) => {
          const status = error ? 'failed' : 'success'
          service('metrics').get(metricNames.apollo.query.validation)?.labels({ ...labels, status }).inc()
        }
      },
      async didResolveOperation(context) {
        const labels = getLabelsFromContext(context);
        service('metrics').get(metricNames.apollo.query.resolved)?.labels({ ...labels }).inc()
      },
      async executionDidStart(context) {
        const labels = getLabelsFromContext(context);

        return {
          willResolveField(field) {
            const resolveEnd = service('metrics').get(metricNames.apollo.query.fieldDuration)?.startTimer({ ...labels });

            return (error) => {
              const status = error ? 'failed' : 'success';
              const fieldLabels = getLabelsFromFieldResolver(field);

              resolveEnd({ ...fieldLabels, status });
            };
          },

          executionDidEnd(error) {
            const status = error ? 'failed' : 'success';
            service('metrics').get(metricNames.apollo.query.executed)?.labels({ ...labels, status }).inc();
          }
        }
      },
      async willSendResponse(context) {
        const status = (context.errors?.length ?? 0) === 0 ? 'success' : 'failed'

        const labels = getLabelsFromContext(context);
        requestEnd({ status, ...labels })
      }
    }
  }
}
