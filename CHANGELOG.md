# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2025-06-27

### Added

- Intelligent route pattern extraction using `_matchedRoute` for low-cardinality metrics
- Advanced path normalization for consistent metric grouping
- Support for Strapi API routes, UUIDs, ObjectIds, and file uploads in route patterns
- Enhanced bucket configurations for better metric granularity

### Changed

- **BREAKING**: Metric label `path` renamed to `route` for consistency
- Improved route labeling strategy to reduce metric cardinality
- Updated request duration buckets for better performance monitoring (removed 20s and 30s buckets)
- Enhanced content length bucket sizing (256KB to 1000MB range)
- Route pattern extraction now happens after routing middleware for accurate matched routes

### Fixed

- Route pattern extraction timing issue - now correctly uses `_matchedRoute` after routing
- Consistent label usage across all HTTP metrics
- Better handling of dynamic route segments (IDs, UUIDs, file names)

## [2.2.2] - 2025-06-27

### Added

- Enhanced HTTP metrics collection with improved labels
- `http_requests_total` counter metric
- `http_active_requests` gauge metric  
- `lifecycle_duration_seconds` histogram for Strapi lifecycle events
- Comprehensive README documentation with examples
- TypeScript configuration examples
- Docker Compose setup examples
- Troubleshooting guide and common issues section

### Changed

- Improved plugin configuration structure and validation
- Enhanced security recommendations and documentation
- Better error handling and logging
- Updated Grafana dashboard examples with PromQL queries

### Fixed

- Configuration syntax corrections in documentation
- Markdown formatting issues in README
- Link references and badge URLs

## [2.1.0] - 2024-12-15

### Added

- Support for custom labels on all metrics
- Enhanced server configuration options
- Better integration with Strapi v5 lifecycle events

### Changed

- Improved performance for high-traffic applications
- Updated dependencies to latest versions

### Fixed

- Memory leak issues with metric collection
- Server startup race conditions

## [2.0.0] - 2024-06-01

### Added

- **Strapi v5 support** - Full compatibility with the latest Strapi version
- **Dedicated metrics server** - Runs on separate port (9000) by default for better security
- **New HTTP metrics**:
  - `http_requests_total` - Total request counter
  - `http_active_requests` - Active requests gauge
- **Enhanced configuration options** - Simplified and more flexible setup
- **TypeScript support** - Full TypeScript definitions included

### Changed

- **Plugin name** - Changed from `strapi-prometheus` to `prometheus` in configuration
- **Default behavior** - Separate metrics server is now the default (more secure)
- **Metric names** - Renamed for clarity and consistency:
  - `http_request_duration_s` → `http_request_duration_seconds`
  - `http_request_size_bytes` → `http_request_content_length_bytes`  
  - `http_response_size_bytes` → `http_response_content_length_bytes`
- **Registry handling** - Now uses default `prom-client` registry for better flexibility
- **Configuration structure** - Simplified and more intuitive setup

### Removed

- **Apollo GraphQL metrics** - Removed built-in Apollo support (use [apollo-prometheus-exporter](https://github.com/bfmatei/apollo-prometheus-exporter) instead)
- **Custom registry option** - Now uses default registry for better ecosystem compatibility
- **Legacy metric names** - Old metric names are no longer supported

### Migration

- See the [Migration Guide](README.md#-migration-guide-v1--v2) for detailed upgrade instructions
- Configuration changes required for existing installations
- Prometheus scrape configuration may need updates for new metric names

## [1.5.0] - 2023-01-31

### Fixed

- Fixed GraphQL metrics always appearing in +inf bucket
- Resolved timing calculation issues for GraphQL operations

## [1.4.0] - 2023-01-15

### Added

- Options for extra registry configuration
- Default registry option support
- Apollo GraphQL metrics integration
- Enhanced metric collection capabilities

### Changed

- Improved enabled metrics configuration options
- Updated metric collection strategies

## [1.3.0] - 2022-12-12

### Added

- Number of open connections metric for monitoring active connections
- Configurable interval settings for metric collection
- Enhanced connection tracking capabilities

## [1.2.0] - 2022-11-27

### Changed

- Automatic middleware registration when plugin is enabled (no manual setup required)
- Improved request/response content length calculation for better accuracy
- Enhanced middleware integration with Strapi's request lifecycle

## [1.1.1] - 2022-11-17

### Changed

- Updated allowed Node.js engines for better compatibility
- Improved package.json engine specifications

## [1.1.0] - 2022-11-04

### Changed

- Single metric endpoint now correctly uses registry and handles errors properly
- Improved error handling and response formatting for metrics endpoints

### Removed

- Authentication restrictions that previously forced API key usage
- Simplified access to metrics endpoints

## [1.0.0] - 2022-11-04

### Added

- Initial release of strapi-prometheus plugin
- Basic HTTP metrics collection for Strapi applications
- Endpoint to retrieve individual metrics
- Integration with Prometheus monitoring ecosystem
- Support for Strapi v4.x applications
