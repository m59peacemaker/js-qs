'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _segment = require('./lib/segment');

var _segment2 = _interopRequireDefault(_segment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const extract = uri => (0, _segment2.default)(uri).query.slice(1);

exports.default = extract;