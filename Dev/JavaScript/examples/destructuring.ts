// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

// Array
let a: number, b: number, rest: number[];
[a, b] = [10, 20];
console.log(a); // 10
console.log(b); // 20

[a, b, ...rest] = [10, 20, 30, 40, 50];
console.log(rest); // [30,40,50]

const foo = [1, 2];
const [one, two] = foo;
console.log(one); // 1
console.log(two); // 2

// Object
const bar = { alice: 60, bob: 70, jane: 80, tim: 90, martha: 100 };
const { alice, bob, ...rest2 } = bar;
console.log(alice); // 60
console.log(bob); // 70
console.log(rest2); // { jane: 80, tim: 90, martha: 100 }
// Rename
const { alice: newAlice, bob: newBob } = bar;
console.log(newAlice); // 60
console.log(newBob); // 70

// Swap variables
let c = 101;
let d = 202;
[c, d] = [d, c];
console.log(c); // 202
console.log(d); // 101

const arr = [1, 2, 3];
[arr[2], arr[1]] = [arr[1], arr[2]];
console.log(arr); // [1, 3, 2]

// Function
const func = () => [4, 5];
const [four, five] = func();
console.log(four); // 4
console.log(five); // 5

// Ignoring values
const func2 = () => [6, 7, 8];
const [six, , eight] = func2();
console.log(six); // 6
console.log(eight); // 8
