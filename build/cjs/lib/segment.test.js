'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _segment = require('./segment');

var _segment2 = _interopRequireDefault(_segment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('segment', t => {
  ;[['', { main: '', query: '', hash: '' }], ['#?', { main: '', query: '', hash: '#?' }], ['m59.us', { main: 'm59.us', query: '', hash: '' }], ['m59.us##', { main: 'm59.us', query: '', hash: '##' }], ['m59.us?foo=bar', { main: 'm59.us', query: '?foo=bar', hash: '' }], ['m59.us?', { main: 'm59.us', query: '?', hash: '' }], ['m59.us?#', { main: 'm59.us', query: '?', hash: '#' }], ['m59.us??#?', { main: 'm59.us', query: '??', hash: '#?' }], ['m59.us?query#', { main: 'm59.us', query: '?query', hash: '#' }], ['m59.us?query#?', { main: 'm59.us', query: '?query', hash: '#?' }], ['m59.us?#hash', { main: 'm59.us', query: '?', hash: '#hash' }], ['?foo=bar', { main: '', query: '?foo=bar', hash: '' }], ['??foo=bar', { main: '', query: '??foo=bar', hash: '' }], ['m59.us#?foo=bar', { main: 'm59.us', query: '', hash: '#?foo=bar' }], ['m59.us?f?f=b', { main: 'm59.us', query: '?f?f=b', hash: '' }], ['m59.us?foo=b?r', { main: 'm59.us', query: '?foo=b?r', hash: '' }], ['m59.us?foo#', { main: 'm59.us', query: '?foo', hash: '#' }], ['m59.us??##?fo=o', { main: 'm59.us', query: '??', hash: '##?fo=o' }], ['??##?foo=bar', { main: '', query: '??', hash: '##?foo=bar' }]].forEach(([input, output]) => {
    t.deepEqual((0, _segment2.default)(input), output, `${input} => ${JSON.stringify(output)}`);
  });
  t.end();
});