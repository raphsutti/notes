# Reduce and flat map

## Reduce

Reduce executes a provided reducer function on each element and return a single output value

[MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

```typescript
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

## Flatmap

1. Returns new array by populating results from a function applied to each element of the array
2. Flatten the result by one level

[MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)

```typescript
let arr1 = [1, 2, 3, 4];

arr1.map((x) => [x * 2]);
// [[2], [4], [6], [8]]

arr1.flatMap((x) => [x * 2]);
// [2, 4, 6, 8]

// only one level is flattened
arr1.flatMap((x) => [[x * 2]]);
// [[2], [4], [6], [8]]

var arr = [1, 2, 3, 4];

arr.flatMap((x) => [x, x * 2]);
// is equivalent to
arr.reduce((acc, x) => acc.concat([x, x * 2]), []);
// [1, 2, 2, 4, 3, 6, 4, 8]
```

## Example - flattening into one array

We have `errors` which is an array of array with objects. We want to flatten this into one array of objects.

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

// reduced:  [
//   { id: 1, message: 'should NOT have fewer than 1 items' },
//   { id: 2, message: 'second error' },
//   { id: 1, message: 'another error' }
// ]

// flatMap
const flatMapped = errors.flatMap((error) => error);
console.log("flatMapped: ", flatMapped);

// flatMapped:  [
//   { id: 1, message: 'should NOT have fewer than 1 items' },
//   { id: 2, message: 'second error' },
//   { id: 1, message: 'another error' }
// ]
```
