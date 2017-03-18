var test = require('tape')
var regex = require('./regex')

test('query string regex', function (t) {
  ;[
    'https://m59.us?foo=bar',
    'https://m59.us?',
    'https://m59.us?#',
    'https://m59.us??#?',
    'https://m59.us?query#',
    'https://m59.us?query#?',
    'https://m59.us?#hash',
    '//m59.us?foo=bar',
    'm59.us?foo=bar',
    '.us?foo=bar',
    '?foo=bar'
  ].forEach(function (url) {
    t.true(regex.test(url), ' matched: ' + url)
  })
  ;[
    'https://m59.us',
    'https://m59.us#?foo=bar',
    '#?foo=bar',
    '##?foo=bar'
  ].forEach(function (url) {
    t.false(regex.test(url), 'did not match: ' + url)
  })
  t.end()
})
