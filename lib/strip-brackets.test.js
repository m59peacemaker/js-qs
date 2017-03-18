var test = require('tape')
var strip = require('./strip-brackets')

test('stripBrackets', function (t) {
  t.equal(strip('foo[]'), 'foo')
  t.equal(strip('foo[0]'), 'foo')
  t.equal(strip('foo[1209]'), 'foo')

  t.equal(strip('foo'), 'foo')
  t.equal(strip('[]'), '[]')
  t.equal(strip('[]foo'), '[]foo')
  t.equal(strip('[0]'), '[0]')
  t.equal(strip('[]0'), '[]0')
  t.equal(strip('foo[d]'), 'foo[d]')
  t.equal(strip('foo[1d]'), 'foo[1d]')

  t.end()
})
