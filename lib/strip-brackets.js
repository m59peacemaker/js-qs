var stripBrackets = function (string) {
  return string.replace(/(.)\[\d*]$/, function (_, keep) {
    return keep
  })
}

module.exports = stripBrackets
