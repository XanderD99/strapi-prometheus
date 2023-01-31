# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2023-01-31

### Fixed

- fix graphql metrics always in +inf bucket

## [1.4.0] - 2023-01-15

### Changed

- changed enabled metrics options

### Added

- add options for extra registry
- add default registry option
- add apollo metrics

## [1.3.0] - 2022-12-12

### Added

- add number of open connections metric
- add interval config

## [1.2.0] - 2022-11-27

### Changed

- automatically add middleware when plugin is enabled
- update request/response length calculation

## [1.1.1] - 2022-11-17

### Changed

- update allowed nodejs engines

## [1.1.0] - 2022-11-04

### Removed

- auth restrictions which forced you to use api key;

### Changed

- get single metric endpoint changed to correctly use register and handle errors.

## [1.0.0] - 2022-11-04

### Added

- endpoint to get one single metric
