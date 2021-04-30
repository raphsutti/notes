# Logical `&&` And

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND

https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator

- Returns left hand side if left hand side is falsey
- Returns right hand side if left hand side is truthy

> Note: Falsey values are `""`, `0`, `false`, `null`

```javascript
console.log("" && "fail") // ""
console.log("This is an error" && "render error") // "render error"
```

Ternary operator

```javascript
console.log("" ? "pass": "fail") // "" is falsey, return "fail"
```
