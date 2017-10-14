'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _encode = require('encode-3986');

var _encode2 = _interopRequireDefault(_encode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FormatArray = (arrayFormat, formatValue, formatPair) => {
  const formatters = {
    duplicate: (k, array) => array.map(v => formatPair(k, v)).join('&'),

    bracket: (k, array) => array.map(v => formatPair(k + '[]', v)).join('&'),

    index: (k, array) => array.map((v, idx) => formatPair(k + '[' + idx + ']', v)).join('&'),

    json: (k, array) => formatPair(k, JSON.stringify(array)),

    delimiter: (delimiter, k, array) => k + '=' + array.map(formatValue).join(delimiter)
  };

  if (typeof arrayFormat === 'object') {
    if (arrayFormat.delimiter) {
      return formatters.delimiter.bind(null, arrayFormat.delimiter);
    } else {
      throw new Error('arrayFormat object is not valid');
    }
  } else {
    const formatter = formatters[arrayFormat];
    if (!formatter) {
      throw new Error('"' + arrayFormat + '" is not a valid array format');
    }
    return formatter;
  }
};

const Format = (arrayFormat, encode) => {
  const formatValue = v => encode(typeof v === 'object' ? JSON.stringify(v) : v);

  const formatPair = (k, v) => {
    if (v === undefined) {
      return '';
    }
    if (v === null) {
      return k;
    }
    return k + '=' + formatValue(v);
  };

  const formatArray = FormatArray(arrayFormat, formatValue, formatPair);

  return (k, v) => {
    const encodedK = encode(k);
    return Array.isArray(v) ? formatArray(encodedK, v) : formatPair(encodedK, v);
  };
};

const stringify = (params, options = {}) => {
  options.arrayFormat = options.arrayFormat || 'duplicate';
  const format = Format(options.arrayFormat, v => {
    v = (0, _encode2.default)(v);
    if (options.plus) {
      v = v.replace(/%20/g, '+');
    }
    return v;
  });
  return Object.keys(params).sort().map(k => format(k, params[k])).join('&');
};

exports.default = stringify;