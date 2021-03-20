// Interface
interface LabeledValue {
  label: string;
}
const printLabel = (labeledObj: LabeledValue) => console.log(labeledObj.label);
let myObj = { size: 10, label: "Size 10 object" };
printLabel(myObj);

// Optional properties
interface SquareConfig {
  color?: string;
  width?: number;
}
const createSquare = (
  config: SquareConfig
): { color: string; area: number } => {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
};
let mySquare = createSquare({ color: "black" });

// Readonly properties
interface Point {
  readonly x: number;
  readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
// p1.x = 5 // cannot assign because it is read-only

let a: number[] = [1, 2, 3, 4];
let readOnlyArray: ReadonlyArray<number> = a;
// readOnlyArray[0] = 12 // only permits reading
// readOnlyArray.push(5)
// readOnlyArray.length = 100
// a = readOnlyArray
a = readOnlyArray as number[]; // but can use assertion

// Function types
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function (src, sub) {
  let result = src.search(sub);
  return result > -1;
};

// Indexable types
interface StringArray {
  [index: number]: string;
}
let myArray: StringArray;
myArray = ["Bob", "Fred"];
let myStr: string = myArray[0];

interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}
interface NotOkay {
  // [x: number]: Animal; // Animal not assignable to Dog
  [x: string]: Dog;
}

interface NumberDictionary {
  [index: string]: number;
  length: number;
  // name: string // error
}
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number;
  name: string;
}
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray2: ReadonlyStringArray = ["Alice", "Bob"];
// myArray2[2] = "Mallory" // error - readonly

// Class types
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}
class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}

// Extending interfaces
interface Shape {
  color: string;
}
interface PenStroke {
  penWidth: number;
}
interface Square extends Shape, PenStroke {
  sideLength: number;
}
let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;

// Hybrid types
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
function getCounter(): Counter {
  let counter = function (start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}
let cc = getCounter();
cc(10);
cc.reset();
cc.interval = 5.0;

// Interfaces extending classes
class Control {
  private state: any;
}
interface SelectableControl extends Control {
  select(): void;
}
class Button extends Control implements SelectableControl {
  select() {}
}
class TextBox extends Control {
  select() {}
}
class ImageControl implements SelectableControl {
  private state: any;
  select() {}
}
