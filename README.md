# svg-to-image-proxy

[![version](https://img.shields.io/npm/v/svg-to-image-proxy.svg?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/svg-to-image-proxy.svg?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/paulmelnikow/svg-to-image-proxy.svg?style=flat-square)][build]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][prettier]

[npm]: https://npmjs.com/svg-to-image-proxy
[build]: https://circleci.com/gh/paulmelnikow/svg-to-image-proxy/tree/master
[prettier]: https://prettier.io/

Web function to generate PNGs from SVGs.

The proxy accepts a request for e.g. `https://raster.example.com/example.png`
and translates it to a request for
`https://other-server.example.com/example.svg`. If the path doesn't contain
`.png`, it passes is unchanged, e.g. `https://raster.example.com/example` to
`https://other-server.example.com/example`.

The query string is also forwarded upstream. Cache headers are forwarded downstream.

The host comes from the `BASE_URL` environment variable.

Designed for [Shields][] though may be useful for other application as well.

[shields]: https://github.com/badges/shields

## Requirements

Requires [ImageMagick](https://www.imagemagick.org/script/download.php).

## Deployment

Runs on Heroku, Zeit Now, and probably most other platforms.

### Heroku

[![](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Optionally after deployment, to push upgrades or work with source code, clone
this repo (or a fork) and connect it with the Heroku app:

```bash
git clone https://github.com/paulmelnikow/svg-to-image-proxy
cd ghost-on-heroku

heroku git:remote --app YOURAPPNAME
heroku info
```

Then you can push commits to the Heroku app, triggering new deployments:

```bash
git add .
git commit -m "Important changes"
git push heroku master
```

Watch the app's server-side behavior to see errors and request traffic:

```bash
heroku logs -t
```

## License

This project is licensed under the MIT license.

## Acknowledgements

Heroku documentation adapted from [ghost-on-heroku][].

[ghost-on-heroku]: https://github.com/cobyism/ghost-on-heroku
