import test from 'tape'
import replace from './replace'

const setMsg = (msg, [ input, output ]) => `${msg} __ ${input} => ${output}`

test('replace', t => {
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
  ].forEach(([ input, output ]) => {
    t.equal(
      replace(input, '', { separator: true }),
      output,
      setMsg('{ separator: true } replaced ?', [ input, output ])
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
  ].forEach(([ input, output ]) => {
    t.equal(
      replace(input, '', { separator: false }),
      output,
      setMsg('{ separator: false } kept ?', [ input, output ])
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
  ].forEach(([ input, output ]) => {
    t.equal(
      replace(input, 'foo=bar'),
      output,
      setMsg('added query string', [ input, output ])
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
  ].forEach(([ input, output ]) => {
    t.equal(
      replace(input, '0_0'),
      output,
      setMsg('replaced query string', [ input, output ])
    )
  })
  t.equal(
    replace('m59.us?123', (string, uri) => {
      t.equal(string, '123', 'replacer receives query string')
      t.equal(uri, 'm59.us?123', 'replacer received uri')
      return string + '456'
    }),
    'm59.us?123456',
    'replacer produced correct result'
  )
  t.equal(
    replace('m59.us', string => {
      t.equal(string, '', 'replacer receives empty string when no query string')
      return ''
    }),
    'm59.us?',
    'replacer automatically added separator, though replacer is nil'
  )

  t.equal(
    replace('m59.us?foo=bar', string => {
      t.equal(string, '?foo=bar', 'replacer receives query string including separator when { separator: true }')
      return ''
    }, { separator: true }),
    'm59.us',
    'replacer did not automatically insert ?'
  )
  t.equal(
    replace('m59.us', string => {
      t.equal(string, '', 'replacer receives empty string when no query string and { separator: true }')
      return '?'
    }, { separator: true }),
    'm59.us?',
    'added separator returned by replacer'
  )

  t.end()
})
