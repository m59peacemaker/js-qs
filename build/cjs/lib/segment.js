'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regex = require('./regex');

var _regex2 = _interopRequireDefault(_regex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const segment = uri => {
  const m = (uri.match(_regex2.default) || []).map(v => v || '');
  return { main: m[1], query: m[2], hash: m[3] };
};

exports.default = segment;