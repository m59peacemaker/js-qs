"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const regex = /(.*)(\[\d*])$/;
// group - optional any amount of anything
// group - ends with [] that can optionally contain any amount of digits

const hasBracket = v => regex.test(v);
const stripBracket = string => string.replace(regex, (_, key) => key);

exports.hasBracket = hasBracket;
exports.stripBracket = stripBracket;