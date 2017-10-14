var regex = /(.*)(\[\d*])$/
// group - optional any amount of anything
// group - ends with [] that can optionally contain any amount of digits

const hasBracket = v => regex.test(v)
const stripBracket = string => string.replace(regex, (_, key) => key)

export {
  hasBracket,
  stripBracket
}
