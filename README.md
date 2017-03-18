# @m59/qs

Parse a query string into an object or stringify an object into a query string.

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
stringify({ foo: ['a', 'b', 'c'] }, { delimiter: '+' })
// => 'foo=a+b+c'
```

Values with delimiters can be parsed as arrays.

```js
parse('foo=a+b+c', { delimiters: ['+'] })
// => { foo: ['a', 'b', 'c'] }
```

If `parse()` is given multiple delimiters, the first given delimiter that exists in the value will be used to split it into an array.

```js
parse('foo=a+b+c&bar=a,b,c&baz=,+,', { delimiters: ['+', ','] })
// => { foo: ['a', 'b', 'c'], bar: ['a', 'b', 'c'], baz: [',', ','] }
```

### nesting

Objects and nested arrays will be stringified as JSON. JSON strings are parsed back to objects by default.

## API

### `parse(string, options)`

- `string: string` a query string
- `options: object`
  - `json: boolean, true` when a value is a JSON string, parse it to object
  - `delimiters: [...strings], []` parse values as arrays when they contain a delimiter
- `=> object` parsed query string

### `stringify(object, options)`

- `object: object` object to be stringified into a query string
- `options: object`
  - `arrayFormat: string | object, 'duplicate'`
    - `'duplicate'`
    - `'bracket'`
    - `'index'`
    - `{ delimiter: string }`
- `=> string` query string
