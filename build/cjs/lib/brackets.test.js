'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _brackets = require('./brackets');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('brackets.hasBracket', t => {
  ;['[]', 'foo[]', '[][]', '[0]', '[][0]', '[34][0]', '[][2348]', '][]', '[[]', '.[]', '[[0]'].forEach(v => {
    t.true((0, _brackets.hasBracket)(v), v);
  });['foo', '[][', '.][', '[]]', '[0]]', '[-]', '[a]'].forEach(v => {
    t.false((0, _brackets.hasBracket)(v), v);
  });
  t.end();
});

(0, _tape2.default)('brackets.stripBracket', t => {
  t.equal((0, _brackets.stripBracket)('foo[]'), 'foo');
  t.equal((0, _brackets.stripBracket)('foo[0]'), 'foo');
  t.equal((0, _brackets.stripBracket)('foo[1209]'), 'foo');
  t.equal((0, _brackets.stripBracket)('foo'), 'foo');
  t.equal((0, _brackets.stripBracket)('[]'), '');
  t.equal((0, _brackets.stripBracket)('[][]'), '[]');
  t.equal((0, _brackets.stripBracket)('[]foo'), '[]foo');
  t.equal((0, _brackets.stripBracket)('[0]'), '');
  t.equal((0, _brackets.stripBracket)('[0][234]'), '[0]');
  t.equal((0, _brackets.stripBracket)('[]0'), '[]0');
  t.equal((0, _brackets.stripBracket)('foo[d]'), 'foo[d]');
  t.equal((0, _brackets.stripBracket)('foo[1d]'), 'foo[1d]');
  t.end();
});