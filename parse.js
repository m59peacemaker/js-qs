'use strict'

var stripBrackets = require('./lib/strip-brackets')

// returns parsed object if `s` is a JSON string or returns undefined
var tryParseJSON = function (s) {
  var first = s.slice(0, 1)
  var last = s.slice(-1)
  if ((first === '{' || first === '[') && (last === '}' || last === ']')) {
    try {
      return JSON.parse(s)
    } catch (err) {}
  }
}

// returns the first delimiter in `delimiters` that is present in `v` or returns `undefined`
var chooseDelimiter = function (delimiters, v) {
  return delimiters.reduceRight(function (acc, d) {
    return v.indexOf(d) !== -1 ? d : acc
  }, undefined)
}

var FormatValue = function (options, decode) {
  var maybeUndefined = function (v) {
    if (v === undefined) { return null }
  }
  var maybeJSON = function (s) {
    if (options.json) { return tryParseJSON(decode(s)) }
  }
  var maybeDelimiter = function (v) {
    if (!options.delimiters) { return }
    var delimiter = chooseDelimiter(options.delimiters, v)
    if (delimiter) {
      return v.split(delimiter).map(function (item) {
        return maybeJSON(item) || decode(item)
      })
    }
  }

  var transformers = [maybeUndefined, maybeJSON, maybeDelimiter, decode]

  return function (v) {
    return transformers.reduce(function (acc, fn) {
      if (acc === undefined) {
        return fn(v)
      }
      return acc
    }, undefined)
  }
}

var unwrapSingleValueArrays = function (obj) {
  return Object.keys(obj).reduce(function (acc, k) {
    var v = obj[k]
    if (v.length === 1) { v = v[0] }
    acc[k] = v
    return acc
  }, {})
}

var parse = function (string, options) {
  options = options || {}
  options.json = options.json === false ? false : true
  options.plus = options.plus === false ? false : true
  options.delimiters = options.delimiters || []
  if (typeof string !== 'string') {
    throw new TypeError('query string must be a string - got "' + typeof string + '"')
  }
  if (options.plus && options.delimiters.indexOf('+') !== -1) {
    throw new Error('"+" cannot be used as a delimiter unless options.plus is false')
  }
  var decode = function (v) {
    if (options.plus) {
      v = v.replace(/\+/g, ' ')
    }
    v = decodeURIComponent(v)
    return v
  }

  var formatValue = FormatValue(options, decode)
  if (!string.length) {
    return {}
  } else {
    var sets = string
      .split('&')
      .reduce(function (acc, part) {
        var x = part.split('=')
        var k = x[0]
        var v = x.length > 1 ? x.slice(1).join('=') : undefined
        k = decode(stripBrackets(k))
        v = formatValue(v)
        acc[k] = acc[k] || []
        acc[k].push(v)
        return acc
      }, {})
    return unwrapSingleValueArrays(sets)
  }
}

module.exports = parse
