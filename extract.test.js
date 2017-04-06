var test = require('tape')
var extract = require('./extract')

test('extract', function (t) {
  ;[
    ['',                        ''],
    ['https://m59.us?foo=bar',  'foo=bar'],
    ['https://m59.us?foo=b?r',  'foo=b?r'],
    ['https://m59.us?foo=#???', 'foo='],
    ['https://m59.us?',         ''],
    ['m59.us?#',       ''],
    ['m59.us??#?',     '?'],
    ['m59.us?query#',  'query'],
    ['m59.us?query#?', 'query'],
    ['m59.us?#hash',   ''],
    ['?foo=bar',       'foo=bar'],
    ['?#',             ''],
    ['?f?oo=bar',      'f?oo=bar'],
    ['??foo=bar',      '?foo=bar'],
    ['??##?foo=bar',   '?']
  ].forEach(function (set) {
    t.equal(extract(set[0]), set[1], set[0] + ' => ' + set[1])
  })

  t.end()
})
