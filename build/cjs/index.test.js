'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const input = {
  foo: ['123', 'false', { x: 'y' }, [1, 2]],
  bar: 'abc',
  baz: 'true',
  qux: { a: 'false' },
  'f!*d++f1312_^%&$%#$': { '$%+,$&^%+-&$,3,,2$!#@$': ['false', '$#%#@%#', [{ a: {} }]] }
};

(0, _tape2.default)('parse(stringify(obj) == obj - isomorphic', t => {
  ;['bracket', 'index', 'json'].forEach(arrayFormat => {
    t.deepEqual(_2.default.parse(_2.default.stringify(input, { arrayFormat })), input, arrayFormat);
  });

  t.deepEqual(_2.default.parse(_2.default.stringify(input, { arrayFormat: { delimiter: ',' } }), { delimiters: [','] }), input);
  t.deepEqual(_2.default.parse(_2.default.stringify(input, { arrayFormat: { delimiter: ';' } }), { delimiters: [',', ';'] }), input);

  t.end();
});

(0, _tape2.default)('isomorphic, stringify(parse(string)) === string', t => {
  ;['bracket', 'index', 'json'].forEach(arrayFormat => {
    const string = _2.default.stringify(input, { arrayFormat });
    t.deepEqual(_2.default.stringify(_2.default.parse(string), { arrayFormat }), string, arrayFormat);
  });

  t.test('delimited arrays', t => {
    const string = _2.default.stringify(input, { arrayFormat: { delimiter: ',' } });
    t.deepEqual(_2.default.stringify(_2.default.parse(string, { delimiters: [','] }), { arrayFormat: { delimiter: ',' } }), string);
    t.end();
  });

  t.test('delimited arrays, back and forth, complex', t => {
    // join arrays on semi-colon
    const string = _2.default.stringify(input, { arrayFormat: { delimiter: ';' } });
    t.deepEqual(_2.default.stringify(
    // parse arrays back out on commas and semicolons
    _2.default.parse(string, { delimiters: [',', ';'] }),
    // join them again on semicolons
    { arrayFormat: { delimiter: ';' } }), string);
    t.end();
  });

  t.end();
});

(0, _tape2.default)('methods on main export', t => {
  t.equal(_2.default.extract('//m59.us:80/_/?foo=bar'), 'foo=bar', 'qs.extract');
  t.deepEqual(_2.default.parse('foo=bar'), { foo: 'bar' }, 'qs.parse');
  t.equal(_2.default.replace('m59.us?foo=bar', 'bar=foo'), 'm59.us?bar=foo', 'qs.replace');
  t.equal(_2.default.stringify({ foo: 'bar' }), 'foo=bar', 'qs.stringify');

  t.end();
});