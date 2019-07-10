# svg-to-image-proxy

[![backers and sponsors](https://img.shields.io/opencollective/all/shields.svg?style=flat-square)][opencollective]
[![chat](https://img.shields.io/discord/308323056592486420.svg?style=flat-square)][discord]
[![version](https://img.shields.io/npm/v/svg-to-image-proxy.svg?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/svg-to-image-proxy.svg?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/badges/svg-to-image-proxy.svg?style=flat-square)][build]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][prettier]

[opencollective]: https://opencollective.com/shields
[npm]: https://npmjs.com/svg-to-image-proxy
[build]: https://circleci.com/gh/badges/svg-to-image-proxy/tree/master
[prettier]: https://prettier.io/
[discord]: https://discordapp.com/invite/HjJCwm5

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

For information about current deploys, see the [Now dashboard][]. See [production hosting][]
for a list of maintainers with access.

`raster.shields.io` is configured in the Shields Cloudflare as a CNAME for
`alias.zeit.co` with traffic configured not to pass through Cloudflare. That's
because it's cached by [Now's Smart CDN][cdn] instead.

### Production Deployment

To deploy, run `now alias shields-raster-staging.now.sh raster.shields.io`.
This ships the current staging build to production.

To setup your environment to run `now`, you'll need to install the CLI, login, and switch to the Shields team.

```bash
npm i -g now
now login
now teams switch shields1
```

[zeit now]: https://zeit.co/now
[cdn]: https://zeit.co/smart-cdn
[now for github]: https://zeit.co/github
[now dashboard]: https://zeit.co/shields1/svg-to-image-proxy
[production hosting]: https://github.com/badges/shields/blob/master/doc/production-hosting.md

## Support

If you're having problems with the service, you can post questions in the
[`#support` room in Discord][discord] and [the main Shields repo][new issue].

## Contributing

If you use and love Shields, we ask that you
[make a one-time \$10 donation to Shields][opencollective]. You can also
contribute monthly or sponsor at a higher level.

Contributions welcome! Feel free to
[open discussions on the main Shields repo][new issue] and to open pull requests here.

The [`#contributing` room in Discord][discord] is also a good place to discuss and ask
questions.

[new issue]: https://github.com/badges/shields/issues/new/choose

## License

This project is licensed under the MIT license.
