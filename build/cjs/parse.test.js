'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('parse', t => {
  try {
    (0, _parse2.default)(['foo']);
    t.fail('should throw when passed a non string');
  } catch (err) {
    t.pass('throws if given non string as query string');
  }
  t.deepEqual((0, _parse2.default)('foo=bar'), { foo: 'bar' }, 'one pair');
  t.deepEqual((0, _parse2.default)('baz=qux&foo=bar'), { foo: 'bar', baz: 'qux' }, 'multiple pairs - keys are sorted');
  t.deepEqual((0, _parse2.default)('f%2Ao=bar'), { 'f*o': 'bar' }, 'decodes keys');
  t.deepEqual((0, _parse2.default)('baz=q%21x&f%2Ao=bar'), { 'f*o': 'bar', baz: 'q!x' }, 'decodes values');
  t.deepEqual((0, _parse2.default)(''), {}, 'nothing - empty object');
  t.deepEqual((0, _parse2.default)('foo=true'), { foo: 'true' }, 'value "true" remains a string');
  t.deepEqual((0, _parse2.default)('foo=false'), { foo: 'false' }, 'value "false" remains a string');
  t.deepEqual((0, _parse2.default)('foo='), { foo: '' }, 'empty string foo=');
  t.deepEqual((0, _parse2.default)('foo'), { foo: null }, 'null value - key only');
  t.deepEqual((0, _parse2.default)('foo==12=3='), { foo: '=12=3=' }, 'value can contain =');

  t.equal(Object.getPrototypeOf((0, _parse2.default)('foo=123&bar=456')), null, 'result object has no prototype');

  t.end();
});

(0, _tape2.default)('parse - wonky input', t => {
  t.deepEqual((0, _parse2.default)('=value'), { '': 'value' }, "starts with = => {'': 'value'}");
  t.deepEqual((0, _parse2.default)('==='), { '': '==' }, "just equal signs === => {'': '=='}");
  t.deepEqual((0, _parse2.default)('==&=='), { '': ['=', '='] }, "==&== => {'': ['=', '=']}");
  t.deepEqual((0, _parse2.default)('==&foo==foo'), { '': '=', foo: '=foo' }, "==&foo==foo => {'': '=', foo: '=foo'}");
  t.end();
});

(0, _tape2.default)('parse - {plus}', t => {
  t.deepEqual((0, _parse2.default)('f+o=a+b%2B+c', { plus: true }), { 'f o': 'a b+ c' }, 'decodes + as space when {plus: true}');
  t.deepEqual((0, _parse2.default)('f+o=a+b%2B+c', { plus: false }), { 'f+o': 'a+b++c' }, 'doesn\'t touch + space when {plus: false}');
  t.deepEqual((0, _parse2.default)('f+o=a+b%2B+c'), { 'f o': 'a b+ c' }, 'decodes + as space by default, {plus: true} is default');
  try {
    (0, _parse2.default)('f+o=a+b%2B+c', { plus: true, delimiters: ['+'] });
    t.fail('did not throw an error when { plus: true, delimiters: [\'+\'] }');
  } catch (err) {
    t.pass('throws error when { plus: true, delimiters: [\'+\'] }. err.message: ' + err.message);
  }
  t.deepEqual((0, _parse2.default)('f+o=a+b%2B+c', { plus: false, delimiters: ['+'] }), { 'f+o': ['a', 'b+', 'c'] }, '+ can be used as a delimiter when { plus: false }');
  t.end();
});

(0, _tape2.default)('parse - array values', t => {
  t.deepEqual((0, _parse2.default)('foo=a&foo=b&foo=c'), { foo: ['a', 'b', 'c'] }, 'parses duplicate keys as array');
  t.deepEqual((0, _parse2.default)('foo[]=a&foo[]=b&foo[]=c'), { foo: ['a', 'b', 'c'] }, 'parses bracket syntax as array');
  t.deepEqual((0, _parse2.default)('foo[]=a&bar=b'), { foo: ['a'], bar: 'b' }, 'parses single item with bracket as array');
  t.deepEqual((0, _parse2.default)('foo[0]=a&foo[1]=b&foo[2]=c'), { foo: ['a', 'b', 'c'] }, 'parses index syntax as array');
  t.deepEqual((0, _parse2.default)('foo[0]=a&bar=b'), { foo: ['a'], bar: 'b' }, 'parses single item with index bracket as array');
  t.deepEqual((0, _parse2.default)('foo[0]=a&foo[1345]=b&foo[2]=c'), { foo: ['a', 'b', 'c'] }, 'bracket index is ignored');
  t.deepEqual((0, _parse2.default)('foo[]=a&foo[0]=b&foo=c'), { foo: ['a', 'b', 'c'] }, 'parses mixed duplicate/bracket/index syntax as array');
  t.deepEqual((0, _parse2.default)('foo=a,b,c', { delimiters: [','] }), { foo: ['a', 'b', 'c'] }, 'splits value on delimiter');
  t.deepEqual((0, _parse2.default)('foo=a,b,c&foo=d;e;f', { delimiters: [',', ';'] }), { foo: [['a', 'b', 'c'], ['d', 'e', 'f']] }, 'multiple delimiters');
  t.deepEqual((0, _parse2.default)('foo=a,b;,c&foo=,d;e;f', { delimiters: [',', ';'] }), { foo: [['a', 'b;', 'c'], ['', 'd;e;f']] }, 'only splits on first delimiter that works');
  t.deepEqual((0, _parse2.default)('foo=a;b;c&foo[]=123', { delimiters: [';'] }), { foo: [['a', 'b', 'c'], '123'] });
  t.deepEqual((0, _parse2.default)('[]=a&[]=[]&[1]=b&[][]&[]&[]='), { '': ['a', [], 'b', null, ''], '[]': [null] }, 'crazy bracket only key stuff');
  t.end();
});

(0, _tape2.default)('parse - json string values', t => {
  t.deepEqual((0, _parse2.default)('a=%7B%22foo%22%3A%22bar%22%7D', { json: true }), { a: { foo: 'bar' } }, 'parses JSON string to object');
  t.deepEqual((0, _parse2.default)('a=%7B%22foo%22%3A%22bar%22%7D'), { a: { foo: 'bar' } }, 'parses JSON string values by default {json: true}');
  t.deepEqual((0, _parse2.default)('a=%7B%22foo%22%3A%22bar%22%7D', { json: false }), { a: '{"foo":"bar"}' }, 'doesn\'t parse JSON string values when {json: false}');
  t.deepEqual((0, _parse2.default)('a=%5B%7B%22foo%22%3A%22bar%22%7D%5D', { json: true }), { a: [{ foo: 'bar' }] }, 'parses JSON string to array');
  t.deepEqual((0, _parse2.default)('a=%7B%22foo%22%22bar%22%7D', { json: true }), { a: '{"foo""bar"}' }, 'assigns malformed json as string value');
  t.deepEqual((0, _parse2.default)('a=%5B%7B%22foo%22%3A%22bar%22%7D%5D', { json: true, delimiters: ['"', ':', ','] }), { a: [{ foo: 'bar' }] }, 'delimiters don\'t break json value');
  t.deepEqual((0, _parse2.default)('foo=123,false,%7B%22x%22%3A%22y%22%7D,%5B1%2C2%5D', { json: true, delimiters: ['"', ':', ','] }), { foo: ['123', 'false', { x: 'y' }, [1, 2]] }, 'delimiters don\'t break nested json value');
  t.deepEqual((0, _parse2.default)('foo=%5B%22a%22%5D&foo=%7B%22a%22%3A%22a%22%7D'), { foo: [['a'], { a: 'a' }] }, 'duplicate keys with json string values');

  t.end();
});