// Boolean
let isDone: boolean = false;

// Number
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
// let big: bigint = 100n;

// String
let color: string = "blue";
color = "red";

let fullName: string = `Bob bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.
I'll be ${age + 1} years old next month.`;

// Array
let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// Tuple
let x: [string, number];
x = ["hello", 10];
console.log(x[0].substring(1));

// Enum
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
let c: Color = Color.Green;
console.log("c: ", c);
let c2: string = Color[2];
console.log("c2: ", c2);

// Unknown
let notSure: unknown = 4;
notSure = "maybe a string instead";
notSure = false;

declare const maybe: unknown;
// const aNumber: number = maybe // cannot assign unknowns to a number (could be string or boolean too)
if (maybe === true) {
  const aBoolean: boolean = maybe;
}
if (typeof maybe === "string") {
  const aString: string = maybe;
}
if (typeof maybe === "number") {
  const aNumber: number = maybe;
}

// Any
declare function getValue(key: string): any;
const str: string = getValue("myString");

let looselyTyped: any = 4;
looselyTyped.toFixed(); // compiler does not check if toFixed exists

let d = looselyTyped.a.b.c.d; // any propagate through objects

// Void
const warnUser = (): void => console.log("Warning");
let unusable: void = undefined;
unusable = null; // can assign null to void

// Null and undefined
let userInput: string | null | undefined;

// Never
function error(message: string): never {
  throw new Error(message);
}
function fail() {
  return error("Something failed");
}
function infiniteLoop(): never {
  while (true) {}
}

// Type assertions
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
