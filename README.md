# svg-to-image-proxy

[![backers and sponsors](https://img.shields.io/opencollective/all/shields.svg)][opencollective]
[![version](https://img.shields.io/npm/v/svg-to-image-proxy.svg?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/svg-to-image-proxy.svg?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/badges/svg-to-image-proxy.svg?style=flat-square)][build]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][prettier]
[![chat](https://img.shields.io/discord/308323056592486420.svg?style=flat-square)][discord]

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

## Deployment

Runs on Zeit Now.

Staging is deployed automatically from master: https://shields-raster-staging.now.sh/

Production is deployed manually for now.

To deploy, run `now alias shields-raster-staging.now.sh raster.shields.io`

The production server is at: https://raster.shields.io/

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
