'use strict'

const { expect } = require('chai')
const got = require('got')
const isPng = require('is-png')
const micro = require('micro')
const nock = require('nock')
const listen = require('test-listen')
const setup = require('.')

const { cleanup } = setup

nock.disableNetConnect()
nock.enableNetConnect(/localhost|127.0.0.1/)

const baseUrl = process.env.BASE_URL

const badgeSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="66" height="20"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="a"><rect width="66" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#a)"><path fill="#555" d="M0 0h37v20H0z"/><path fill="#007ec6" d="M37 0h29v20H37z"/><path fill="url(#b)" d="M0 0h66v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110"> <text x="195" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="270">hello</text><text x="195" y="140" transform="scale(.1)" textLength="270">hello</text><text x="505" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="190">bar</text><text x="505" y="140" transform="scale(.1)" textLength="190">bar</text></g> </svg>'

after(async function () {
  await cleanup()
})

describe('svg-to-image-proxy endpoint', function () {
  let service, url
  beforeEach(async function () {
    this.timeout('10s')
    service = micro(await setup)
    url = await listen(service)
  })
  afterEach(function () {
    if (service) {
      service.close()
      service = undefined
    }
  })

  it('rasterizes svg fetched from the expected address', async function () {
    this.timeout('20s')

    const scope = nock(baseUrl)
      .get('/badge/foo-bar-blue.svg')
      .reply(200, badgeSvg)

    const { body, statusCode } = await got(`${url}/badge/foo-bar-blue.svg`, {
      encoding: null,
      retry: { retries: 0 },
    })

    expect(body).to.satisfy(isPng)
    expect(statusCode).to.equal(200)

    scope.done()
  })

  it('sets the appropriate content-type header', async function () {
    const scope = nock(baseUrl)
      .get('/badge/foo-bar-blue.svg')
      .reply(200, badgeSvg)

    const { headers } = await got(`${url}/badge/foo-bar-blue.svg`, {
      encoding: null,
      retry: { retries: 0 },
    })

    expect(headers['content-type']).to.equal('image/png')

    scope.done()
  })

  it('forwards query params', async function () {
    const scope = nock(baseUrl)
      .get('/badge/foo-bar-blue.svg?label=hello')
      .reply(200, badgeSvg)

    await got(`${url}/badge/foo-bar-blue.svg?label=hello`, {
      encoding: null,
      retry: { retries: 0 },
    })

    scope.done()
  })

  it('forwards If-None-Match request header upstream', async function () {
    const scope = nock(baseUrl)
      .get('/badge/foo-bar-blue.svg')
      .matchHeader('if-none-match', 'abcde')
      .reply(200, badgeSvg)

    await got(`${url}/badge/foo-bar-blue.svg`, {
      encoding: null,
      retry: { retries: 0 },
      headers: { 'If-None-Match': 'abcde' },
    })

    scope.done()
  })

  it('forwards Cache-Control response header downstream', async function () {
    const scope = nock(baseUrl)
      .get('/badge/foo-bar-blue.svg')
      .reply(200, badgeSvg, { 'Cache-Control': 'max-age=0, must-revalidate' })

    const { headers } = await got(`${url}/badge/foo-bar-blue.svg`, {
      encoding: null,
    })

    expect(headers['cache-control']).to.equal('max-age=0, must-revalidate')

    scope.done()
  })

  it('displays an error badge when the upstream server provides invalid SVG', async function () {
    this.timeout(5000)
    const scope = nock(baseUrl)
      .get('/badge/foo-bar-blue.svg')
      // The server tries three times.
      .times(3)
      .reply(500)

    const { body, statusCode } = await got(`${url}/badge/foo-bar-blue.svg`, {
      encoding: null,
      retry: { retries: 0 },
      throwHttpErrors: false,
    })

    expect(statusCode).to.equal(502)
    expect(body).to.satisfy(isPng)

    scope.done()
  })
})
