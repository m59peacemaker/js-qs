var segment = require('./lib/segment')

var extract = function (uri) {
  return segment(uri).query.slice(1)
}

module.exports = extract
