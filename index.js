'use strict'

const { URL } = require('url')
const chrome = require('chrome-aws-lambda')
const { createConverter } = require('convert-svg-to-png')
const got = require('got')
const isSvg = require('is-svg')

const baseUrl = process.env.BASE_URL
if (!baseUrl) {
  throw Error('BASE_URL must be set to the server that is hosting the SVGs')
}

const requestHeadersToForward = [
  'if-modified-since',
  'if-unmodified-since',
  'if-none-match',
]

const responseHeadersToForward = [
  'date',
  'cache-control',
  'expires',
  'last-modified',
]

let cleanup
async function setup() {
  const converter = createConverter({
    puppeteer: {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    },
  })
  cleanup = async () => converter.destroy()

  const errorBadge = await converter.convert(
    // Fetched from https://img.shields.io/badge/invalid-svg-red.svg
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="160" height="20"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="a"><rect width="160" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#a)"><path fill="#555" d="M0 0h37v20H0z"/><path fill="#e05d44" d="M37 0h123v20H37z"/><path fill="url(#b)" d="M0 0h160v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110"> <text x="195" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="270">error</text><text x="195" y="140" transform="scale(.1)" textLength="270">error</text><text x="975" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="1130">invalid svg response</text><text x="975" y="140" transform="scale(.1)" textLength="1130">invalid svg response</text></g> </svg>'
  )

  async function handler(req, res) {
    res.setHeader('content-type', 'image/png')

    const requestHeaders = {}
    requestHeadersToForward.forEach(header => {
      requestHeaders[header] = req.headers[header]
    })

    // Ensure we're always using the `baseUrl` by using just the path from
    // the request URL.
    const { pathname, search } = new URL(req.url, 'https://bogus.test')

    const outPath = pathname.replace('.png', '.svg')
    const outUrl = new URL(outPath, baseUrl)
    outUrl.search = search

    const { body: svg, headers: responseHeaders, statusCode } = await got(
      outUrl,
      {
        headers: requestHeaders,
        throwHttpErrors: false,
      }
    )
    console.log(`Status code ${statusCode}`)

    responseHeadersToForward.forEach(header => {
      if (header in responseHeaders) {
        res.setHeader(header, responseHeaders[header])
      }
    })

    if (statusCode === 304) {
      // Do not send any content.
      res.statusCode = 304
      return ''
    }

    if (isSvg(svg)) {
      return converter.convert(svg)
    } else {
      res.statusCode = 502
      return errorBadge
    }
  }

  return handler
}
const handlerPromise = setup()

module.exports = async (req, res) =>
  require('micro').run(req, res, async (req, res) =>
    (await handlerPromise)(req, res)
  )
module.exports.cleanup = async () => cleanup()
