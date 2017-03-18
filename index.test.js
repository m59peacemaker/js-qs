var test = require('tape')
var qs = require('./')

var input = {
  foo: ['123', 'false', {x: 'y'}, [1, 2]],
  bar: 'abc',
  baz: 'true',
  qux: {a: 'false'},
  'f!*d++f1312_^%&$%#$': {'$%+,$&^%+-&$,3,,2$!#@$': ['false', '$#%#@%#', [{a: {}}]]}
}

test('parse(stringify(obj) == obj - isomorphic', function (t) {
  ;['bracket', 'index', 'json'].forEach(function (format) {
    t.deepEqual(
      qs.parse(qs.stringify(input, {arrayFormat: format})),
      input,
      format
    )
  })

  t.deepEqual(
    qs.parse(
      qs.stringify(input, {arrayFormat: {delimiter: ','}}),
      {delimiters: [',']}
    ),
    input
  )
  t.deepEqual(
    qs.parse(
      qs.stringify(input, {arrayFormat: {delimiter: '+'}}),
      {delimiters: [',', '+']}
    ),
    input
  )

  t.end()
})

test('stringify(parse(string) == string - isomorphic', function (t) {
  ;['bracket', 'index', 'json'].forEach(function (format) {
    var string = qs.stringify(input, {arrayFormat: format})
    t.deepEqual(
      qs.stringify(qs.parse(string), {arrayFormat: format}),
      string,
      format
    )
  })

  var string = qs.stringify(input, {arrayFormat: {delimiter: ','}})
  t.deepEqual(
    qs.stringify(
      qs.parse(string, {delimiters: [',']}),
      {arrayFormat: {delimiter: ','}}
    ),
    string
  )

  var string = qs.stringify(input, {arrayFormat: {delimiter: '+'}})
  t.deepEqual(
    qs.stringify(
      qs.parse(string, {delimiters: [',', '+']}),
      {arrayFormat: {delimiter: '+'}}
    ),
    string
  )

  t.end()
})

test('methods on main export', function (t) {
  t.equal(qs.extract('//m59.us:80/_/?foo=bar'), '?foo=bar', 'qs.extract')
  t.deepEqual(qs.parse('foo=bar'), { foo: 'bar' }, 'qs.parse')
  t.equal(qs.replace('?foo=bar', '?bar=foo'), '?bar=foo', 'qs.replace')
  t.equal(qs.stringify({ foo: 'bar' }), 'foo=bar', 'qs.stringify')
  t.end()
})
