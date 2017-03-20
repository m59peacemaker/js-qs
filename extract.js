var segment = require('./lib/segment')

var extract = function (uri) {
  return segment(uri).query
}

module.exports = extract
