import segment from './lib/segment'

const replace = (uri, replacer, { separator = false } = {}) => {
  const segments = segment(uri)
  if (!separator) {
    segments.query = segments.query.slice(1)
  }
  const query = (!separator ? '?' : '')
    + (typeof replacer === 'function' ? replacer(segments.query, uri) : replacer)
  return segments.main + query + segments.hash
}

export default replace
