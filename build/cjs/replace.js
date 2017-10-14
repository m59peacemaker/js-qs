'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _segment = require('./lib/segment');

var _segment2 = _interopRequireDefault(_segment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const replace = (uri, replacer, { separator = false } = {}) => {
  const segments = (0, _segment2.default)(uri);
  if (!separator) {
    segments.query = segments.query.slice(1);
  }
  const query = (!separator ? '?' : '') + (typeof replacer === 'function' ? replacer(segments.query, uri) : replacer);
  return segments.main + query + segments.hash;
};

exports.default = replace;