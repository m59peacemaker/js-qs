var regex = require('./lib/regex')

var replace = function (url, replacer) {
  return url.replace(regex, function (_, qsStart, start, qs) {
    return (start || '') + (typeof replacer === 'function' ? replacer(qs || qsStart) : replacer)
  })
}

module.exports = replace
