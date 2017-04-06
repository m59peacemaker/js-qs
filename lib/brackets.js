var regex = /(.*)(\[\d*])$/
// group - optional any amount of anything
// group - ends with [] that can optionally contain any amount of digits

var brackets = {
  hasBracket: function (v) { return regex.test(v) },
  stripBracket: function (string) {
    return string.replace(regex, function (_, key) {
      return key
    })
  }
}

module.exports = brackets
