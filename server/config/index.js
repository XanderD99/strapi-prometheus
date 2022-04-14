'use strict';

module.exports = {
  default: () => ({
    defaultMetricsInterval: 10000,
    durationBuckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5],
    requestSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    responseSizeBuckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    useUniqueHistogramName: false,
    metricsPrefix: "",
    excludeRoutes: [],
    includeQueryParams: false,
    additionalLabels: [],
    extractAdditionalLabelValuesFn: undefined
  }),
  validator() { },
};
