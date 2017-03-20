var strictEncode = require('encode-3986')

var FormatArray = function (arrayFormat, formatValue, formatPair) {
  var formatters = {
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

  if (typeof arrayFormat === 'object') {
    if (arrayFormat.delimiter) {
      return formatters.delimiter.bind(null, arrayFormat.delimiter)
    } else {
      throw new Error('arrayFormat object is not valid')
    }
  } else {
    var formatter = formatters[arrayFormat]
    if (!formatter) {
      throw new Error('"' + arrayFormat + '" is not a valid array format')
    }
    return formatter
  }
}

var Format = function (arrayFormat, encode) {
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

  var formatArray = FormatArray(arrayFormat, formatValue, formatPair)

  return function (k, v) {
    k = encode(k)
    return Array.isArray(v) ? formatArray(k, v) : formatPair(k, v)
  }
}

var stringify = function (params, options) {
  options = options || {}
  options.plus = options.plus ? true : false
  options.arrayFormat = options.arrayFormat || 'duplicate'
  var format = Format(options.arrayFormat, function (v) {
    v = strictEncode(v)
    if (options.plus) {
      v = v.replace(/%20/g, '+')
    }
    return v
  })
  return Object.keys(params).sort().map(function (k) {
    return format(k, params[k])
  }).join('&')
}

module.exports = stringify
