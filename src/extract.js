import segment from './lib/segment'

const extract = uri => segment(uri).query.slice(1)

export default extract
