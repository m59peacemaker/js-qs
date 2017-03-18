var test = require('tape')
var parse = require('./parse')

test('parse', function (t) {
  t.deepEqual(
    parse('foo=bar'),
    {foo: 'bar'},
    'one pair'
  )
  t.deepEqual(
    parse('baz=qux&foo=bar'),
    {foo: 'bar', baz: 'qux'},
    'multiple pairs - keys are sorted'
  )
  t.deepEqual(
    parse('f%2Ao=bar'),
    {'f*o': 'bar'},
    'decodes keys'
  )
  t.deepEqual(
    parse('baz=q%21x&f%2Ao=bar'),
    {'f*o': 'bar', baz: 'q!x'},
    'decodes values'
  )
  t.deepEqual(
    parse(''),
    {},
    'nothing - empty object'
  )
  t.deepEqual(
    parse('foo=true'),
    {foo: 'true'},
    'value "true" remains a string'
  )
  t.deepEqual(
    parse('foo=false'),
    {foo: 'false'},
    'value "false" remains a string'
  )
  t.deepEqual(
    parse('foo='),
    {foo: ''},
    'empty string foo='
  )
  t.deepEqual(
    parse('foo'),
    {foo: null},
    'null value - key only'
  )
  t.end()
})

test('parse - array values', function (t) {
  t.deepEqual(
    parse('foo=a&foo=b&foo=c'),
    {foo: ['a', 'b', 'c']},
    'parses duplicate keys as array'
  )
  t.deepEqual(
    parse('foo[]=a&foo[]=b&foo[]=c'),
    {foo: ['a', 'b', 'c']},
    'parses bracket syntax as array'
  )
  t.deepEqual(
    parse('foo[0]=a&foo[1]=b&foo[2]=c'),
    {foo: ['a', 'b', 'c']},
    'parses index syntax as array'
  )
  t.deepEqual(
    parse('foo[0]=a&foo[1345]=b&foo[2]=c'),
    {foo: ['a', 'b', 'c']},
    'bracket index is ignored'
  )
  t.deepEqual(
    parse('foo[]=a&foo[0]=b&foo=c'),
    {foo: ['a', 'b', 'c']},
    'parses mixed duplicate/bracket/index syntax as array'
  )
  t.deepEqual(
    parse('foo=a,b,c', {delimiters: [',']}),
    {foo: ['a', 'b', 'c']},
    'splits value on delimiter'
  )
  t.deepEqual(
    parse('foo=a,b,c&foo=d+e+f', {delimiters: [',', '+']}),
    {foo: [['a', 'b', 'c'], ['d', 'e', 'f']]},
    'multiple delimiters'
  )
  t.deepEqual(
    parse('foo=a,b+,c&foo=,d+e+f', {delimiters: [',', '+']}),
    {foo: [['a', 'b+', 'c'], ['', 'd+e+f']]},
    'only splits on first delimiter that works'
  )
  t.end()
})

test('parse - json string values', function (t) {
  t.deepEqual(
    parse('a=%7B%22foo%22%3A%22bar%22%7D', {json: true}),
    {a: {foo: 'bar'}},
    'parses JSON string to object'
  )
  t.deepEqual(
    parse('a=%7B%22foo%22%3A%22bar%22%7D'),
    {a: {foo: 'bar'}},
    'parses JSON string values by default {json: true}'
  )
  t.deepEqual(
    parse('a=%7B%22foo%22%3A%22bar%22%7D', {json: false}),
    {a: '{"foo":"bar"}'},
    'doesn\'t parse JSON string values when {json: false}'
  )
  t.deepEqual(
    parse('a=%5B%7B%22foo%22%3A%22bar%22%7D%5D', {json: true}),
    {a: [{foo: 'bar'}]},
    'parses JSON string to array'
  )
  t.deepEqual(
    parse('a=%7B%22foo%22%22bar%22%7D', {json: true}),
    {a: '{"foo""bar"}'},
    'assigns malformed json as string value'
  )
  t.deepEqual(
    parse('a=%5B%7B%22foo%22%3A%22bar%22%7D%5D', {json: true, delimiters: ['"', ':', ',']}),
    {a: [{foo: 'bar'}]},
    'delimiters don\'t break json value'
  )
  t.deepEqual(
    parse(
      'foo=123,false,%7B%22x%22%3A%22y%22%7D,%5B1%2C2%5D',
      {json: true, delimiters: ['"', ':', ',']}
    ),
    {foo: ['123', 'false', {x: 'y'}, [1, 2]]},
    'delimiters don\'t break nested json value'
  )
  t.deepEqual(
    parse('foo=%5B%22a%22%5D&foo=%7B%22a%22%3A%22a%22%7D'),
    {foo: [['a'], {a: 'a'}]},
    'duplicate keys with json string values'
  )
  t.end()
})
