# @m59/qs

Functions for working with query strings.

## install

```sh
$ npm install @m59/qs
```

## example

```js
const qs = require('@m59/qs')

qs.stringify({ crust: 'thin', toppings: ['pepperoni', 'pepperoni', 'bacon'] })
// => 'crust=thin&toppings=pepperoni&toppings=pepperoni&toppings=bacon'

qs.parse('crust=thin&toppings=pepperoni&toppings=pepperoni&toppings=bacon')
// => { crust: 'thin', toppings: ['pepperoni', 'pepperoni', 'bacon'] }

qs.extract('http://pizza.pl0x?breadsticks=please#yum')
// => 'breadsticks=please'

qs.replace('http://pizza.pl0x?breadsticks=please#yum', queryString => 'breadsticks=seriously&marinara')
// => 'http://pizza.pl0x?breadsticks=seriously&marinara#yum'
```

## array formats

`stringify()` can output array values in different formats. `parse()` will parse all of them.

### duplicate (default)

```js
stringify({ foo: ['a', 'b', 'c'] }, { arrayFormat: 'duplicate' })
// => 'foo=a&foo=b&foo=c'
```

### bracket

```js
stringify({ foo: ['a', 'b', 'c'] }, { arrayFormat: 'bracket' })
// => 'foo[]=a&foo[]=b&foo[]=c'
```

### index

Indices are only aesthetic - they do not necessarily correspond to array index. Items should appear in order.

```js
stringify({ foo: ['a', 'b', 'c'] }, { arrayFormat: 'index' })
// => 'foo[0]=a&foo[1]=b&foo[2]=c'
```

### json

Turn arrays into JSON strings.

```js
stringify({ foo: [true, 123, 'abc', {x: false}] }, { arrayFormat: 'json' })
// => 'foo=%5Btrue%2C123%2C%22abc%22%2C%7B%22x%22%3Afalse%7D%5D'
```

### delimiters

Arrays can be output as a single key=value pair with the items joined by a delimiter.

```js
stringify({ foo: ['a', 'b', 'c'] }, { delimiter: ';' })
// => 'foo=a;b;c'
```

Values with delimiters can be parsed as arrays.

```js
parse('foo=a;b;c', { delimiters: [';'] })
// => { foo: ['a', 'b', 'c'] }
```

If `parse()` is given multiple delimiters, the first given delimiter that exists in the value will be used to split it into an array.

```js
parse('foo=a;b;c&bar=a,b,c&baz=,;,', { delimiters: [';', ','] })
// => { foo: ['a', 'b', 'c'], bar: ['a', 'b', 'c'], baz: [',', ','] }
```

## nesting

Objects and nested arrays will be stringified as JSON. JSON strings are parsed back to objects by default.

## `+`

According to [RFC 1738](https://www.ietf.org/rfc/rfc1738.txt), a space should be encoded as `+`, and `+` should be parsed back to a space. That specification was updated in 2005 by [RFC 3986](https://www.ietf.org/rfc/rfc3986.txt), which states that `+` should be encoded as UTF-8 `%20`. Query strings ought to adhere to 3986 and therefore the meaning of `+` in a query string is technically ambiguous. However, many query string encoders still encode spaces to `+`, so parsers must parse `+` as a space.

## API

### `parse(queryString, options)`

- `queryString: string` a query string
- `options: object`
  - `json: boolean, true` when a value is a JSON string, parse it to object
  - `delimiters: [...strings], []` parse values as arrays when they contain a delimiter
  - `plus: boolean, true` when `true` (default), decode `+` into a space
- `=> object` parsed query string

### `stringify(object, options)`

- `object: object` object to be stringified into a query string
- `options: object`
  - `arrayFormat: string | object, 'duplicate'`
    - `'duplicate'`
    - `'bracket'`
    - `'index'`
    - `{ delimiter: string }`
  - `plus: boolean, false` when `true`, encode spaces as `+`
- `=> string` query string

### `extract(uri)`

- `uri: string` uri to extract the query string from
- `=> string` extracted query string

### `replace(uri, replacer, options)`

- `uri: string` uri to replace the query string in
- `replacer: string | function`
  - `string` new query string value
  - `replacer(queryString)`
    - `queryString: string` the query string from `uri` or an empty string if `uri` does not have a query string
    - `uri` the `uri` argument passed to `replace`
    - `=> newQueryString: string` new query string value
- `options: object`
  - `separator: boolean, false` when `true`, the `?` separator will be included in the replacement, so `queryString` passed to `replacer` will include it if it exists in `uri`, and it will be replaced in `uri` by `replacer`.
- `=> string` `uri` with the query string replaced
