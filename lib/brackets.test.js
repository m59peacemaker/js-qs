var test = require('tape')
var brackets = require('./brackets')
var has = brackets.hasBracket
var strip = brackets.stripBracket

test('brackets.hasBracket', function (t) {
  ;[
    '[]',
    'foo[]',
    '[][]',
    '[0]',
    '[][0]',
    '[34][0]',
    '[][2348]',
    '][]',
    '[[]',
    '.[]',
    '[[0]'
  ].forEach(function (v) {
    t.true(has(v), v)
  })
  ;[
    'foo',
    '[][',
    '.][',
    '[]]',
    '[0]]',
    '[-]',
    '[a]'
  ].forEach(function (v) {
    t.false(has(v), v)
  })
  t.end()
})

test('brackets.stripBracket', function (t) {
  t.equal(strip('foo[]'), 'foo')
  t.equal(strip('foo[0]'), 'foo')
  t.equal(strip('foo[1209]'), 'foo')
  t.equal(strip('foo'), 'foo')
  t.equal(strip('[]'), '')
  t.equal(strip('[][]'), '[]')
  t.equal(strip('[]foo'), '[]foo')
  t.equal(strip('[0]'), '')
  t.equal(strip('[0][234]'), '[0]')
  t.equal(strip('[]0'), '[]0')
  t.equal(strip('foo[d]'), 'foo[d]')
  t.equal(strip('foo[1d]'), 'foo[1d]')
  t.end()
})
