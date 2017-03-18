var test = require('tape')
var stringify = require('./stringify')

test('stringify', function (t) {
  t.equal(
    stringify({}),
    '',
    'empty object results in empty string'
  )
  t.equal(
    stringify({foo: 'bar'}),
    'foo=bar',
    'one pair'
  )
  t.equal(
    stringify({foo: 'bar', baz: 'qux'}),
    'baz=qux&foo=bar',
    'multiple pairs - keys are sorted'
  )
  t.equal(
    stringify({'f*o': 'bar'}),
    'f%2Ao=bar',
    'encodes keys'
  )
  t.equal(
    stringify({'f*o': 'bar', baz: 'q!x'}),
    'baz=q%21x&f%2Ao=bar',
    'encodes values'
  )
  ;(function () {
    var result = stringify({a: {foo: 'bar'}})
    t.equal(result, 'a=%7B%22foo%22%3A%22bar%22%7D', 'stringifies object value')
    t.deepEqual(
      JSON.parse(decodeURIComponent(result.slice(2))),
      {foo: 'bar'},
      'stringifies object value'
    )
  })()
  t.equal(
    stringify({foo: undefined}),
    '',
    'undefined values are excluded'
  )
  t.equal(
    stringify({foo: true}),
    'foo=true',
    'boolean true values foo=true'
  )
  t.equal(
    stringify({foo: false}),
    'foo=false',
    'boolean false values foo=false'
  )
  t.equal(
    stringify({foo: ''}),
    'foo=',
    'empty string foo='
  )
  t.equal(
    stringify({foo: null}),
    'foo',
    'null value - key only'
  )
  try {
    stringify({a: 'a'}, {arrayFormat: 'troll'})
    t.fail('did not throw when passed invalid arrayFormat')
  } catch (err) {
    t.pass('threw when passed invalid arrayFormat. err.message: ' + err.message)
  }
  t.end()
})

test('stringify - values are arrays', function (t) {
  t.equal(
    stringify({foo: ['a', 'b', 'c']}, {arrayFormat: 'duplicate'}),
    'foo=a&foo=b&foo=c',
    'arrayFormat: \'duplicate\' - arrays as duplicate keys'
  )
  t.equal(
    stringify({foo: ['a', 'b', 'c']}),
    'foo=a&foo=b&foo=c',
    'arrayFormat: \'duplicate\' - is default'
  )
  t.equal(
    stringify({foo: ['a', 'b', 'c']}, {arrayFormat: 'bracket'}),
    'foo[]=a&foo[]=b&foo[]=c',
    'arrayFormat: \'bracket\' - foo[]=value'
  )
  t.equal(
    stringify({foo: ['a', 'b', 'c']}, {arrayFormat: 'index'}),
    'foo[0]=a&foo[1]=b&foo[2]=c',
    'arrayFormat: \'index\' - foo[0]=value'
  )
  ;(function () {
    var result = stringify({a: ['a', 'b', 'c']}, {arrayFormat: 'json'})
    t.deepEqual(JSON.parse(decodeURIComponent(result.slice(2))), ['a', 'b', 'c']),
    'arrayFormat: \'json\' - foo=%5B%22a%22%2C%22b%22%2C%22c%22%5D'
  })()
  t.equal(
    stringify({foo: ['a', 'b', 'c']}, {arrayFormat: {delimiter: ','}}),
    'foo=a,b,c',
    'arrayFormat: {delimiter: \',\'} - foo=a,b,c'
  )
  t.equal(
    stringify({foo: ['a', 'b', 'c']}, {arrayFormat: {delimiter: '+'}}),
    'foo=a+b+c',
    'arrayFormat: {delimiter: \'+\'} - foo=a+b+c'
  )
  t.equal(
    stringify({foo: [123, false, {x: 'y'}, [1, 2]]}, {arrayFormat: 'duplicate'}),
    'foo=123&foo=false&foo=%7B%22x%22%3A%22y%22%7D&foo=%5B1%2C2%5D',
    'nested objects/arrays into JSON strings'
  )
  t.end()
})
