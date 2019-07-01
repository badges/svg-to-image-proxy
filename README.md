# svg-to-image-proxy

[![version](https://img.shields.io/npm/v/svg-to-image-proxy.svg?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/svg-to-image-proxy.svg?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/badges/svg-to-image-proxy.svg?style=flat-square)][build]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][prettier]

[npm]: https://npmjs.com/svg-to-image-proxy
[build]: https://circleci.com/gh/badges/svg-to-image-proxy/tree/master
[prettier]: https://prettier.io/

Web function to generate PNGs from SVGs. Based on [convert-svg-to-png][]
which uses headless Chromium.

The proxy accepts a request for e.g. `https://raster.example.com/example.png`
and translates it to a request for
`https://other-server.example.com/example.svg`. If the path doesn't contain
`.png`, it passes is unchanged, e.g. `https://raster.example.com/example` to
`https://other-server.example.com/example`.

The query string is also forwarded upstream. Cache headers are forwarded downstream.

The host comes from the `BASE_URL` environment variable.

Designed for [Shields][] though may be useful for other application as well.

[shields]: https://github.com/badges/shields
[convert-svg-to-png]: https://www.npmjs.com/package/convert-svg-to-png

## Deployment

Runs on Zeit Now.

Staging is deployed automatically from master: https://shields-raster-staging.now.sh/

Production is deployed manually for now.

To deploy, run `now alias shields-raster-staging.now.sh shields-raster.now.sh`

The production server is at: https://raster.shields.io/

## License

This project is licensed under the MIT license.
