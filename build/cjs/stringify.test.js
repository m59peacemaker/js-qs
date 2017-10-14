'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _stringify = require('./stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('stringify', t => {
  t.equal((0, _stringify2.default)({}), '', 'empty object results in empty string');
  t.equal((0, _stringify2.default)({ foo: 'bar' }), 'foo=bar', 'one pair');
  t.equal((0, _stringify2.default)({ foo: 'bar', baz: 'qux' }), 'baz=qux&foo=bar', 'multiple pairs - keys are sorted');
  t.equal((0, _stringify2.default)({ 'f*o': 'bar' }), 'f%2Ao=bar', 'encodes keys');
  t.equal((0, _stringify2.default)({ 'f*o': 'bar', baz: 'q!x' }), 'baz=q%21x&f%2Ao=bar', 'encodes values');(() => {
    const result = (0, _stringify2.default)({ a: { foo: 'bar' } });
    t.equal(result, 'a=%7B%22foo%22%3A%22bar%22%7D', 'stringifies object value');
    t.deepEqual(JSON.parse(decodeURIComponent(result.slice(2))), { foo: 'bar' }, 'stringifies object value');
  })();
  t.equal((0, _stringify2.default)({ foo: undefined }), '', 'undefined values are excluded');
  t.equal((0, _stringify2.default)({ foo: true }), 'foo=true', 'boolean true values foo=true');
  t.equal((0, _stringify2.default)({ foo: false }), 'foo=false', 'boolean false values foo=false');
  t.equal((0, _stringify2.default)({ foo: '' }), 'foo=', 'empty string foo=');
  t.equal((0, _stringify2.default)({ foo: null }), 'foo', 'null value - key only');
  try {
    (0, _stringify2.default)({ a: 'a' }, { arrayFormat: 'troll' });
    t.fail('did not throw when passed invalid arrayFormat');
  } catch (err) {
    t.pass('threw when passed invalid arrayFormat. err.message: ' + err.message);
  }
  try {
    (0, _stringify2.default)({ a: 'a' }, { arrayFormat: { delimiterrible: true } });
    t.fail('did not throw when passed invalid arrayFormat object');
  } catch (err) {
    t.pass('threw when passed invalid arrayFormat object. err.message: ' + err.message);
  }
  t.equal((0, _stringify2.default)({ 'f o': 'a b+ c' }, { plus: false }), 'f%20o=a%20b%2B%20c', 'encodes spaces as utf-8 when {plus: false}');
  t.equal((0, _stringify2.default)({ 'f o': 'a b+ c' }, { plus: true }), 'f+o=a+b%2B+c', 'encodes spaces as + when {plus: true}');
  t.equal((0, _stringify2.default)({ '%20': ' %20 +' }, { plus: true }), '%2520=+%2520+%2B', '{plus: true} doesn\t conflict with values that were already utf-8 encoded spaces');
  t.equal((0, _stringify2.default)({ 'f o': 'a b+ c' }), 'f%20o=a%20b%2B%20c', 'encodes spaces as utf-8 by default, {plus: false} is default');
  t.end();
});

(0, _tape2.default)('stringify - values are arrays', t => {
  t.equal((0, _stringify2.default)({ foo: ['a', 'b', 'c'] }, { arrayFormat: 'duplicate' }), 'foo=a&foo=b&foo=c', 'arrayFormat: \'duplicate\' - arrays as duplicate keys');
  t.equal((0, _stringify2.default)({ foo: ['a', 'b', 'c'] }), 'foo=a&foo=b&foo=c', 'arrayFormat: \'duplicate\' - is default');
  t.equal((0, _stringify2.default)({ foo: ['a', 'b', 'c'] }, { arrayFormat: 'bracket' }), 'foo[]=a&foo[]=b&foo[]=c', 'arrayFormat: \'bracket\' - foo[]=value');
  t.equal((0, _stringify2.default)({ foo: ['a', 'b', 'c'] }, { arrayFormat: 'index' }), 'foo[0]=a&foo[1]=b&foo[2]=c', 'arrayFormat: \'index\' - foo[0]=value');(() => {
    const result = (0, _stringify2.default)({ a: ['a', 'b', 'c'] }, { arrayFormat: 'json' });
    t.deepEqual(JSON.parse(decodeURIComponent(result.slice(2))), ['a', 'b', 'c'], 'arrayFormat: \'json\' - foo=%5B%22a%22%2C%22b%22%2C%22c%22%5D');
  })();
  t.equal((0, _stringify2.default)({ foo: ['a', 'b', 'c'] }, { arrayFormat: { delimiter: ',' } }), 'foo=a,b,c', 'arrayFormat: {delimiter: \',\'} - foo=a,b,c');
  t.equal((0, _stringify2.default)({ foo: ['a', 'b', 'c'] }, { arrayFormat: { delimiter: ';' } }), 'foo=a;b;c', 'arrayFormat: {delimiter: \';\'} - foo=a;b;c');
  t.equal((0, _stringify2.default)({ foo: [123, false, { x: 'y' }, [1, 2]] }, { arrayFormat: 'duplicate' }), 'foo=123&foo=false&foo=%7B%22x%22%3A%22y%22%7D&foo=%5B1%2C2%5D', 'nested objects/arrays into JSON strings');

  t.end();
});