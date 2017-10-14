'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _extract = require('./extract');

var _extract2 = _interopRequireDefault(_extract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('extract', t => {
  ;[['', ''], ['https://m59.us?foo=bar', 'foo=bar'], ['https://m59.us?foo=b?r', 'foo=b?r'], ['https://m59.us?foo=#???', 'foo='], ['https://m59.us?', ''], ['m59.us?#', ''], ['m59.us??#?', '?'], ['m59.us?query#', 'query'], ['m59.us?query#?', 'query'], ['m59.us?#hash', ''], ['?foo=bar', 'foo=bar'], ['?#', ''], ['?f?oo=bar', 'f?oo=bar'], ['??foo=bar', '?foo=bar'], ['??##?foo=bar', '?']].forEach(([input, output]) => t.equal((0, _extract2.default)(input), output, `${input} => ${output}`));

  t.end();
});