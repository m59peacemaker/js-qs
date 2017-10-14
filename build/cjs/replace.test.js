'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _replace = require('./replace');

var _replace2 = _interopRequireDefault(_replace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const setMsg = (msg, [input, output]) => `${msg} __ ${input} => ${output}`;

(0, _tape2.default)('replace', t => {
  ;[['', ''], ['m59.us?foo=bar', 'm59.us'], ['m59.us?', 'm59.us'], ['m59.us?#', 'm59.us#'], ['m59.us??#?', 'm59.us#?'], ['m59.us?query#', 'm59.us#'], ['m59.us?query#?', 'm59.us#?'], ['m59.us?#hash', 'm59.us#hash'], ['?foo=bar', ''], ['??foo=bar', '']].forEach(([input, output]) => {
    t.equal((0, _replace2.default)(input, '', { separator: true }), output, setMsg('{ separator: true } replaced ?', [input, output]));
  });[['', '?'], ['m59.us?foo=bar', 'm59.us?'], ['m59.us?', 'm59.us?'], ['m59.us?#', 'm59.us?#'], ['m59.us??#?', 'm59.us?#?'], ['m59.us?query#', 'm59.us?#'], ['m59.us?query#?', 'm59.us?#?'], ['m59.us?#hash', 'm59.us?#hash'], ['?foo=bar', '?'], ['??foo=bar', '?']].forEach(([input, output]) => {
    t.equal((0, _replace2.default)(input, '', { separator: false }), output, setMsg('{ separator: false } kept ?', [input, output]));
  });
  t.equal((0, _replace2.default)('', '', { separator: true }), '', '{ separator: true } sanity check');
  t.equal((0, _replace2.default)('', ''), '?', '{ separator: false } is default');[['', '?foo=bar'], ['#?', '?foo=bar#?'], ['m59.us', 'm59.us?foo=bar'], ['m59.us##', 'm59.us?foo=bar##']].forEach(([input, output]) => {
    t.equal((0, _replace2.default)(input, 'foo=bar'), output, setMsg('added query string', [input, output]));
  });[['m59.us#?foo=bar', 'm59.us?0_0#?foo=bar'], ['m59.us?foo=bar', 'm59.us?0_0'], ['m59.us?foo?foo=bar', 'm59.us?0_0'], ['m59.us?foo=b?r', 'm59.us?0_0'], ['m59.us?foo#', 'm59.us?0_0#'], ['m59.us??##?foo=bar', 'm59.us?0_0##?foo=bar'], ['??##?foo=bar', '?0_0##?foo=bar']].forEach(([input, output]) => {
    t.equal((0, _replace2.default)(input, '0_0'), output, setMsg('replaced query string', [input, output]));
  });
  t.equal((0, _replace2.default)('m59.us?123', (string, uri) => {
    t.equal(string, '123', 'replacer receives query string');
    t.equal(uri, 'm59.us?123', 'replacer received uri');
    return string + '456';
  }), 'm59.us?123456', 'replacer produced correct result');
  t.equal((0, _replace2.default)('m59.us', string => {
    t.equal(string, '', 'replacer receives empty string when no query string');
    return '';
  }), 'm59.us?', 'replacer automatically added separator, though replacer is nil');

  t.equal((0, _replace2.default)('m59.us?foo=bar', string => {
    t.equal(string, '?foo=bar', 'replacer receives query string including separator when { separator: true }');
    return '';
  }, { separator: true }), 'm59.us', 'replacer did not automatically insert ?');
  t.equal((0, _replace2.default)('m59.us', string => {
    t.equal(string, '', 'replacer receives empty string when no query string and { separator: true }');
    return '?';
  }, { separator: true }), 'm59.us?', 'added separator returned by replacer');

  t.end();
});