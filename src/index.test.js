import test from 'tape'
import qs from './'

const input = {
  foo: [ '123', 'false', { x: 'y' }, [ 1, 2 ] ],
  bar: 'abc',
  baz: 'true',
  qux: { a: 'false' },
  'f!*d++f1312_^%&$%#$': { '$%+,$&^%+-&$,3,,2$!#@$': [ 'false', '$#%#@%#', [ { a: {} } ] ] }
}

test('parse(stringify(obj) == obj - isomorphic', t => {
  ;[ 'bracket', 'index', 'json' ].forEach(arrayFormat => {
    t.deepEqual(
      qs.parse(qs.stringify(input, { arrayFormat })),
      input,
      arrayFormat
    )
  })

  t.deepEqual(
    qs.parse(
      qs.stringify(input, { arrayFormat: { delimiter: ',' } }),
      { delimiters: [ ',' ] }
    ),
    input
  )
  t.deepEqual(
    qs.parse(
      qs.stringify(input, { arrayFormat: { delimiter: ';' } }),
      { delimiters: [ ',', ';' ] }
    ),
    input
  )

  t.end()
})

test('isomorphic, stringify(parse(string)) === string', t => {
  ;[ 'bracket', 'index', 'json' ]
    .forEach(arrayFormat => {
      const string = qs.stringify(input, { arrayFormat })
      t.deepEqual(
        qs.stringify(qs.parse(string), { arrayFormat }),
        string,
        arrayFormat
      )
    })

  t.test('delimited arrays', t => {
    const string = qs.stringify(input, { arrayFormat: { delimiter: ',' } })
    t.deepEqual(
      qs.stringify(
        qs.parse(string, { delimiters: [ ',' ] }),
        { arrayFormat: { delimiter: ',' } }
      ),
      string
    )
    t.end()
  })

  t.test('delimited arrays, back and forth, complex', t => {
    // join arrays on semi-colon
    const string = qs.stringify(input, { arrayFormat: { delimiter: ';' } })
    t.deepEqual(
      qs.stringify(
        // parse arrays back out on commas and semicolons
        qs.parse(string, { delimiters: [ ',', ';' ] }),
        // join them again on semicolons
        { arrayFormat: { delimiter: ';' } }
      ),
      string
    )
    t.end()
  })

  t.end()
})

test('methods on main export', t => {
  t.equal(qs.extract('//m59.us:80/_/?foo=bar'), 'foo=bar', 'qs.extract')
  t.deepEqual(qs.parse('foo=bar'), { foo: 'bar' }, 'qs.parse')
  t.equal(qs.replace('m59.us?foo=bar', 'bar=foo'), 'm59.us?bar=foo', 'qs.replace')
  t.equal(qs.stringify({ foo: 'bar' }), 'foo=bar', 'qs.stringify')

  t.end()
})
