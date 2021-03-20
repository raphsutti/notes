// Numeric enums
enum Direction {
  Up = 3,
  Down = 6,
  Left,
  Right,
}
enum UserResponse {
  No = 0,
  Yes = 1,
}
function respond(recipient: string, message: UserResponse): void {
  // ...
}
respond("Princess Caroline", UserResponse.Yes);

// String enums
enum Direction2 {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// Heterogeneous enums - dont do this
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}

// Union enums and enum member types
enum ShapeKind {
  Circle,
  Square,
}
interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}
interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}
let c: Circle = {
  kind: ShapeKind.Circle,
  radius: 100,
};

enum E {
  Foo,
  Bar,
}
function f(x: E) {
  // if (x !== E.Foo || x !== E.Bar) {
  // This condition is always true
  // }
}

// Enums at runtime
enum E {
  X = 0,
  Y,
  Z,
}
function f2(obj: { X: number }) {
  return obj.X;
}
f2(E); // Works since E has property X: number

// Enum at compile time
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}
type LogLevelStrings = keyof typeof LogLevel;
// same as
// type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'
function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level key is:", key);
    console.log("Log level value is:", num);
    console.log("Log level message is:", message);
  }
}
printImportant("ERROR", "This is a message");

// reverse mappings
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // A

// const enums
const enum Enum2 {
  A = 1,
  B = A * 2,
}

const enum Direction3 {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Direction3.Up,
  Direction3.Down,
  Direction3.Left,
  Direction3.Right,
];

// ambient enums
declare enum Enum {
  A2 = 1,
  B,
  C = 2,
}
