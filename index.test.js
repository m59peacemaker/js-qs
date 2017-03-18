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
