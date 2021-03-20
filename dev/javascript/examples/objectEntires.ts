// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries

const object1 = {
  a: "somestring",
  b: 42,
};

console.log(Object.entries(object1)); // [ [ 'a', 'somestring' ], [ 'b', 42 ] ]

for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}
// "a: somestring"
// "b: 42"
// order is not guaranteed
