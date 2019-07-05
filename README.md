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

## Architecture

- The code is is [one file][].
- It's based on the [Micro][] framework.
- Rasterization uses headless Chromium via [Puppeteer][], wrapped in the
  [convert-svg-to-png][] library.
- The service has no state. It simply fetches corresponding SVG badges from the
  upstream service, rasterizes them, and forwards cache headers along with the
  response.
- Caching the rasterized badges is handled by a downstream CDN.

[one file]: https://github.com/badges/svg-to-image-proxy/blob/master/rasterize.js
[micro]: https://github.com/zeit/micro
[puppeteer]: https://pptr.dev/

## Deployment

Runs on Zeit Now.

## raster.shields.io production hosting

Staging: https://shields-raster-staging.now.sh/

Production: https://raster.shields.io/

`raster.shields.io` hosting is provided by:

- [Zeit Now][zeit now]
- [Zeit Smart CDN][cdn]
- [Now for GitHub][]

Pull requests are deployed automatically. Staging is deployed automatically
from master. Production is deployed manually for now.

For information about current deploys, see the [Now dashboard][].

To deploy, run `now alias shields-raster-staging.now.sh raster.shields.io`.
This ships the current staging build to production.

`raster.shields.io` is configured in the Shields Cloudflare as a CNAME for
`alias.zeit.co` with traffic configured not to pass through Cloudflare. That's
because it's cached by [Now's Smart CDN][cdn] instead.

[zeit now]: https://zeit.co/now
[cdn]: https://zeit.co/smart-cdn
[now for github]: https://zeit.co/github
[now dashboard]: https://zeit.co/shields1/svg-to-image-proxy

## License

This project is licensed under the MIT license.
