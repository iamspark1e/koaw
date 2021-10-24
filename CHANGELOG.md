## [0.0.3-canary.2](https://github.com/arctome/koaw/compare/v0.0.3-canary.1...v0.0.3-canary.2) (2021-10-24)

### Bug Fixes

- `Transformer` should not parse JSON response automatically ([00712ce](https://github.com/arctome/koaw/commit/00712ce73dad09539c18e36d25a8ccc23e066f52))

## [0.0.3-canary.1](https://github.com/arctome/koaw/compare/v0.0.3-canary.0...v0.0.3-canary.1) (2021-10-19)

### Bug Fixes

- `Transformer.responseToCtx` throw error when response does not contain "Content-Type" header ([e7f22a2](https://github.com/arctome/koaw/commit/e7f22a24575bcaf77a302d2e393fdc854e92f421))

## [0.0.3-canary.0](https://github.com/arctome/koaw/compare/v0.0.2...v0.0.3-canary.0) (2021-10-18)

### Bug Fixes

- `cors` plugin return 204 for every request ([1f0a18f](https://github.com/arctome/koaw/commit/1f0a18fe2cf7d505df439e9256b58ebe9b803e96))
- `cors` plugin return 204 for every request ([51ff14f](https://github.com/arctome/koaw/commit/51ff14f80be5248e351a9018e0a789343dff0cb0))
- fix empty option error in `new Koaw(event, options?)` ([cc0a6a6](https://github.com/arctome/koaw/commit/cc0a6a62dfbeeb8e415a56abd7282519113ace6e))

## [0.0.2](https://github.com/arctome/koaw/compare/v0.0.1...v0.0.2) (2021-09-27)

### Features

- **plugin:** add `Transformer` for convert middlewares that return `Response` ([ac5d881](https://github.com/arctome/koaw/commit/ac5d88136d44d01d798d946b9b4453ef425e3afc))

## 0.0.1 (2021-09-24)

### Features

- **base:** finish base middleware loader ([52239a0](https://github.com/arctome/koaw/commit/52239a0e9222b11a61472cc27f01bba6a30fcc12))
- **core:** add chain usage & tests ([4d6ec88](https://github.com/arctome/koaw/commit/4d6ec88ecdf859797bff9283c79c6822678617f7))
- **core:** remove the requirement of return `ctx`, improve unit tests ([4836bb9](https://github.com/arctome/koaw/commit/4836bb94230f9e6b1ad16461d56a047c0848cd04))
- **plugin:** add `koaw-router` to core package ([33ee538](https://github.com/arctome/koaw/commit/33ee538699ef6e96aff6fbe063df1906812316be))
- **plugin:** fix `KoawRouter` & add `cors` ([cfc785c](https://github.com/arctome/koaw/commit/cfc785c1bd3f46d2f066e556eedd061aa32eec46))
