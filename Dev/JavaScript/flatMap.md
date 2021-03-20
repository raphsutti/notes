# Reduce and flat map

## Reduce

Reduce executes a provided reducer function on each element and return a single output value

```typescript
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10
```

```typescript
const errors = [
  [
    {
      id: 1,
      message: "should NOT have fewer than 1 items",
    },
    {
      id: 2,
      message: "second error",
    },
  ],
  [
    {
      id: 1,
      message: "another error",
    },
  ],
];

// reduce
const reduced = errors.reduce((acc, error) => [...acc, ...error]);
console.log("reduced: ", reduced);

// flatMap
const flatMapped = errors.flatMap((error) => error);
console.log("flatMapped: ", flatMapped);
```
