'use strict'

var stripBrackets = require('./lib/strip-brackets')
var decode = decodeURIComponent

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

var formatValue = function (options, v) {
  var maybeTryJSON = function (s) {
    if (options.json) {
      return tryParseJSON(s)
    }
  }

  return [
    function (v) {
      if (v === undefined) {
        return null
      }
    },
    function (v) {
      return maybeTryJSON(decode(v))
    },
    function (v) {
      var delimiter = chooseDelimiter(options.delimiters, v)
      if (delimiter) {
        return v.split(delimiter).map(function (item) {
          item = decode(item)
          return maybeTryJSON(item) || item
        })
      }
    },
    decode
  ].reduce(function (acc, fn) {
    if (acc === undefined) {
      return fn(v)
    }
    return acc
  }, undefined)
}

var parse = function (string, options) {
  if (typeof string !== 'string') {
    throw new TypeError('query string must be a string - got "' + typeof string + '"')
  }
  options = options || {json: true, delimiters: []}
  options.json = options.json === false ? false : true
  options.delimiters = options.delimiters || []
  var sets = string
    .split('&')
    .reduce(function (acc, pair) {
      var x = pair.split('=')
      var k = x[0]
      var v = x[1]
      if (!k || !k.length) { return acc }
      k = decode(stripBrackets(k))
      v = formatValue(options, v)
      acc[k] = acc[k] || []
      acc[k].push(v)
      return acc
    }, {})
  return Object
    .keys(sets)
    .reduce(function (acc, k) {
      var v = sets[k]
      if (v.length === 1) { v = v[0] }
      acc[k] = v
      return acc
    }, {})
}

module.exports = parse
