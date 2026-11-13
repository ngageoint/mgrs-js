# Change Log
All notable changes to this project will be documented in this file.
Adheres to [Semantic Versioning](http://semver.org/).

---

## 1.1.0 (TBD)

* Polar (UPS) MGRS coordinates at and north of 84°N and south of 80°S (bands A, B, Y and Z, no zone number) in `MGRS.from`, `parse`, `isMGRS`, `toPoint` and `coordinate`; new `UPS` class and `MGRS.isPolar` ([#11](https://github.com/ngageoint/mgrs-js/pull/11))
* UTM conversion uses the Krüger series (Karney 2011), accurate to nanometers instead of centimeters, and no longer rounds to 1 cm before MGRS truncation; some 1 m MGRS coordinates change by 1 m to match GeographicLib ([#9](https://github.com/ngageoint/mgrs-js/pull/9))
* Fix `parse` decoding points just north of a latitude band edge 2,000 km too far north ([#8](https://github.com/ngageoint/mgrs-js/pull/8))
* `parse` and `isMGRS` reject 100 km column letters not used in the zone ([#10](https://github.com/ngageoint/mgrs-js/pull/10))
* Fix grid lines drawn diagonally at zone bounds ([#7](https://github.com/ngageoint/mgrs-js/pull/7), fixes [#6](https://github.com/ngageoint/mgrs-js/issues/6))


## [1.0.0](https://github.com/ngageoint/mgrs-js/releases/tag/1.0.0) (11/27/2022)

* Initial Release (port of mgrs-java 2.1.0)