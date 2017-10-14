import test from 'tape'
import { hasBracket as has, stripBracket as strip } from './brackets'

test('brackets.hasBracket', t => {
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
  ].forEach(v => {
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
  ].forEach(v => {
    t.false(has(v), v)
  })
  t.end()
})

test('brackets.stripBracket', t => {
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
