'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _try_catch = require('try_catch');

var _try_catch2 = _interopRequireDefault(_try_catch);

var _brackets = require('./lib/brackets');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns parsed object if `s` is a JSON string or returns undefined
const tryParseJSON = s => {
  const first = s.slice(0, 1);
  const last = s.slice(-1);
  if ((first === '{' || first === '[') && (last === '}' || last === ']')) {
    return (0, _try_catch2.default)(() => JSON.parse(s), () => undefined);
  }
};

// returns the first delimiter in `delimiters` that is present in `v` or returns `undefined`
const chooseDelimiter = (delimiters, v) => delimiters.reduceRight((acc, d) => v.indexOf(d) !== -1 ? d : acc, undefined);

const FormatValue = (options, decode) => {
  const maybeUndefined = v => v === undefined ? null : undefined;
  const maybeJSON = s => options.json ? tryParseJSON(decode(s)) : undefined;
  const maybeDelimiter = v => {
    const delimiter = chooseDelimiter(options.delimiters, v);
    return delimiter ? v.split(delimiter).map(item => maybeJSON(item) || decode(item)) : undefined;
  };

  const transformers = [maybeUndefined, maybeJSON, maybeDelimiter, decode];

  return v => transformers.reduce((acc, fn) => acc === undefined ? fn(v) : acc, undefined);
};

const parse = (string, options = {}) => {
  options.json = options.json !== false;
  options.plus = options.plus !== false;
  options.delimiters = options.delimiters || [];

  if (typeof string !== 'string') {
    throw new TypeError('query string must be a string - got "' + typeof string + '"');
  }
  if (options.plus && options.delimiters.indexOf('+') !== -1) {
    throw new Error('"+" cannot be used as a delimiter unless options.plus is false');
  }

  const decode = v => {
    if (options.plus) {
      v = v.replace(/\+/g, ' ');
    }
    return decodeURIComponent(v);
  };

  const formatValue = FormatValue(options, decode);

  const params = Object.create(null);
  const isGrouped = {};
  string.length && string.split('&').forEach(part => {
    const x = part.split('=');
    const _k = x[0];
    const k = decode((0, _brackets.stripBracket)(_k));
    const _v = x.length > 1 ? x.slice(1).join('=') : undefined;
    let v = formatValue(_v);

    if (Object.prototype.hasOwnProperty.call(params, k)) {
      // key has appeared before
      if (!isGrouped[k]) {
        params[k] = [params[k]];
        isGrouped[k] = true;
      }
      params[k].push(v);
    } else {
      // first time seeing this key
      if ((0, _brackets.hasBracket)(_k)) {
        // has a bracket, must be an array
        v = [v];
        isGrouped[k] = true;
      }
      params[k] = v;
    }
  });

  return params;
};

exports.default = parse;