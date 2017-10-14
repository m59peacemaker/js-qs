import test from 'tape'
import extract from './extract'

test('extract', t => {
  ;[
    [ '',                        '' ],
    [ 'https://m59.us?foo=bar',  'foo=bar' ],
    [ 'https://m59.us?foo=b?r',  'foo=b?r' ],
    [ 'https://m59.us?foo=#???', 'foo=' ],
    [ 'https://m59.us?',         '' ],
    [ 'm59.us?#',       '' ],
    [ 'm59.us??#?',     '?' ],
    [ 'm59.us?query#',  'query' ],
    [ 'm59.us?query#?', 'query' ],
    [ 'm59.us?#hash',   '' ],
    [ '?foo=bar',       'foo=bar' ],
    [ '?#',             '' ],
    [ '?f?oo=bar',      'f?oo=bar' ],
    [ '??foo=bar',      '?foo=bar' ],
    [ '??##?foo=bar',   '?' ]
  ].forEach(([ input, output ]) => t.equal(extract(input), output, `${input} => ${output}`))

  t.end()
})
