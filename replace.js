var segment = require('./lib/segment')

var replace = function (uri, replacer, options) {
  var sep = options && options.separator
  var segments = segment(uri)
  if (!sep) {
    segments.query = segments.query.slice(1)
  }
  var query = (!sep ? '?' : '') + (typeof replacer === 'function' ? replacer(segments.query, uri) : replacer)
  return segments.main + query + segments.hash
}

module.exports = replace
