var regex = require('./lib/regex')

var extract = function (url) {
  var matches = url.match(regex)
  return matches ? matches[3] || matches[0] : ''
}

module.exports = extract
