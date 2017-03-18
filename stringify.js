var encode = require('encode-3986')

var formatValue = function (v) {
  if (typeof v === 'object') {
    v = JSON.stringify(v)
  }
  return encode(v)
}

var formatPair = function (k, v) {
  if (v === undefined) { return '' }
  if (v === null) { return k }
  return k + '=' + formatValue(v)
}

var arrayFormatters = {
  duplicate: function (k, array) {
    return array
      .map(function (v) {
        return formatPair(k, v)
      })
      .join('&')
  },
  bracket: function (k, array) {
    return array
      .map(function (v) {
        return formatPair(k + '[]', v)
      })
      .join('&')
  },
  index: function (k, array) {
    return array
      .map(function (v, idx) {
        return formatPair(k + '[' + idx + ']', v)
      })
      .join('&')
  },
  json: function (k, array) {
    return formatPair(k, JSON.stringify(array))
  },
  delimiter: function (delimiter, k, array) {
    return k + '=' + array.map(formatValue).join(delimiter)
  }
}

var getArrayFormatter = function (format) {
  if (typeof format === 'object') {
    return arrayFormatters.delimiter.bind(null, format.delimiter)
  } else {
    return arrayFormatters[format || 'duplicate']
  }
}

var stringify = function (params, options) {
  options = options || {}
  var formatArray = getArrayFormatter(options.arrayFormat)
  if (!formatArray) {
    throw new Error('"' + options.arrayFormat + '" is not a valid array format')
  }
  return Object
    .keys(params)
    .sort()
    .map(function (k) {
      var v = params[k]
      k = encode(k)
      if (Array.isArray(v)) {
        return formatArray(k, v)
      } else {
        return formatPair(k, v)
      }
    })
    .join('&')
}

module.exports = stringify
