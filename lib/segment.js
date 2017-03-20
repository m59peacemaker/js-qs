var regex = require('./regex')

var segment = function (uri) {
  var m = (uri.match(regex) || []).map(function (v) {
    return v || ''
  })
  return { main: m[1], query: m[2], hash: m[3] }
}

module.exports = segment
