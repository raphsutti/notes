# Nullish Coalescing

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator

- `??` operator
- Returns right hand side operand when left hand side is `null` or `undefined`
- Traditionally `||` operand was used to assign default values when unassigned
  - However, this can cause unexpected behaviour for falsey values such as `''` or `0`

```javascript
const foo = 0
console.log(foo || 2) // 0 is considered falsey, returns 2

const bar = ''
console.log(bar || 2) // '' is considered falsey, returns 2

const foobaz = 0
console.log(foobaz ?? 2) // 0

const barbaz = ''
console.log(barbaz ?? 2) // ''
```

A better example is when you have a form with a price. If the price is not defined, we want to give a default tax
```javascript
const tax = 0.1
const total = (tax * 10) + 10
console.log(total) // 11
```

We give a default tax if not specified
```javascript
const tax = undefined
const total = ((tax || 0.1) * 10) + 10
console.log(total) // 11
```

But what if there is actually no tax? `tax = 0`
```javascript
const tax = 0
const total = ((tax || 0.1) * 10) + 10
console.log(total) // Should be 10 but we get 11?!
```

A better way is to use `??` nullish coalescing operator
```javascript
const tax = 0
const total = ((tax ?? 0.1) * 10) + 10
console.log(total) // 10 😌
```
