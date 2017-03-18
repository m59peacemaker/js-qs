var test = require('tape')
var replace = require('./replace')

test('replace', function (t) {
  ;[
    ['',               ''],
    ['m59.us?foo=bar', 'm59.us'],
    ['m59.us?',        'm59.us'],
    ['m59.us?#',       'm59.us#'],
    ['m59.us??#?',     'm59.us#?'],
    ['m59.us?query#',  'm59.us#'],
    ['m59.us?query#?', 'm59.us#?'],
    ['m59.us?#hash',   'm59.us#hash'],
    ['?foo=bar',       ''],
    ['??foo=bar',      '']
  ].forEach(function (set) {
    t.equal(replace(set[0], ''), set[1], set[0] + ' => ' + set[1])
  })
  ;[
    ['m59.us#?foo=bar',    'm59.us#?foo=bar'],
    ['m59.us?foo=bar',     'm59.us?0_0'],
    ['m59.us?foo?foo=bar', 'm59.us?0_0'],
    ['m59.us?foo=b?r',     'm59.us?0_0'],
    ['m59.us?foo#',        'm59.us?0_0#'],
    ['m59.us??##?foo=bar', 'm59.us?0_0##?foo=bar'],
    ['??##?foo=bar',       '?0_0##?foo=bar']
  ].forEach(function (set) {
    t.equal(replace(set[0], '?0_0'), set[1], set[0] + ' => ' + set[1])
  })
  t.equal(
    replace('m59.us?123', function (string) {
      t.equal(string, '?123', 'replacer receives query string')
      return string + '456'
    }),
    'm59.us?123456',
    'replacer produced correct result'
  )
  t.end()
})
