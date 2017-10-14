import regex from './regex'

const segment = uri => {
  const m = (uri.match(regex) || []).map(v => v || '')
  return { main: m[1], query: m[2], hash: m[3] }
}

export default segment
