import test from 'tape'
import replace from './replace'

var setMsg = function (msg, set) {
  return msg + ' __ ' + set[0] + ' => ' + set[1]
}

test('replace', function (t) {
  ;[
    [ '',               '' ],
    [ 'm59.us?foo=bar', 'm59.us' ],
    [ 'm59.us?',        'm59.us' ],
    [ 'm59.us?#',       'm59.us#' ],
    [ 'm59.us??#?',     'm59.us#?' ],
    [ 'm59.us?query#',  'm59.us#' ],
    [ 'm59.us?query#?', 'm59.us#?' ],
    [ 'm59.us?#hash',   'm59.us#hash' ],
    [ '?foo=bar',       '' ],
    [ '??foo=bar',      '' ]
  ].forEach(function (set) {
    t.equal(
      replace(set[0], '', { separator: true }),
      set[1],
      setMsg('{ separator: true } replaced ?', set)
    )
  })
  ;[
    [ '',               '?' ],
    [ 'm59.us?foo=bar', 'm59.us?' ],
    [ 'm59.us?',        'm59.us?' ],
    [ 'm59.us?#',       'm59.us?#' ],
    [ 'm59.us??#?',     'm59.us?#?' ],
    [ 'm59.us?query#',  'm59.us?#' ],
    [ 'm59.us?query#?', 'm59.us?#?' ],
    [ 'm59.us?#hash',   'm59.us?#hash' ],
    [ '?foo=bar',       '?' ],
    [ '??foo=bar',      '?' ]
  ].forEach(function (set) {
    t.equal(
      replace(set[0], '', { separator: false }),
      set[1],
      setMsg('{ separator: false } kept ?', set)
    )
  })
  t.equal(
    replace('', '', { separator: true }),
    '',
    '{ separator: true } sanity check'
  )
  t.equal(
    replace('', ''),
    '?',
    '{ separator: false } is default'
  )
  ;[
    [ '',         '?foo=bar' ],
    [ '#?',       '?foo=bar#?' ],
    [ 'm59.us',   'm59.us?foo=bar' ],
    [ 'm59.us##', 'm59.us?foo=bar##' ]
  ].forEach(function (set) {
    t.equal(
      replace(set[0], 'foo=bar'),
      set[1],
      setMsg('added query string', set)
    )
  })
  ;[
    [ 'm59.us#?foo=bar',    'm59.us?0_0#?foo=bar' ],
    [ 'm59.us?foo=bar',     'm59.us?0_0' ],
    [ 'm59.us?foo?foo=bar', 'm59.us?0_0' ],
    [ 'm59.us?foo=b?r',     'm59.us?0_0' ],
    [ 'm59.us?foo#',        'm59.us?0_0#' ],
    [ 'm59.us??##?foo=bar', 'm59.us?0_0##?foo=bar' ],
    [ '??##?foo=bar',       '?0_0##?foo=bar' ]
  ].forEach(function (set) {
    t.equal(
      replace(set[0], '0_0'),
      set[1],
      setMsg('replaced query string', set)
    )
  })
  t.equal(
    replace('m59.us?123', function (string, uri) {
      t.equal(string, '123', 'replacer receives query string')
      t.equal(uri, 'm59.us?123', 'replacer received uri')
      return string + '456'
    }),
    'm59.us?123456',
    'replacer produced correct result'
  )
  t.equal(
    replace('m59.us', function (string) {
      t.equal(string, '', 'replacer receives empty string when no query string')
      return ''
    }),
    'm59.us?',
    'replacer automatically added separator, though replacer is nil'
  )

  t.equal(
    replace('m59.us?foo=bar', function (string) {
      t.equal(string, '?foo=bar', 'replacer receives query string including separator when { separator: true }')
      return ''
    }, { separator: true }),
    'm59.us',
    'replacer did not automatically insert ?'
  )
  t.equal(
    replace('m59.us', function (string) {
      t.equal(string, '', 'replacer receives empty string when no query string and { separator: true }')
      return '?'
    }, { separator: true }),
    'm59.us?',
    'added separator returned by replacer'
  )

  t.end()
})
