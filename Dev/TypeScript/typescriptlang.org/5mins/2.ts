// Union
type MyBool = true | false;
type WindowStates = "open" | "closed" | "minimized";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;

const getLength = (obj: string | string[]) => obj.length;

const wrapInArray = (obj: string | string[]) => {
  if (typeof obj === "string") {
    return [obj];
  } else {
    return obj;
  }
};

// Generics
type StringArray = string[];
type NumberArray = Array<number>;
type ObjectWithNameArray = { name: string }[];

interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

declare const backpack: Backpack<string>;
const object = backpack.get();
// backpack.add(23) // error

// Structural Type System
interface Point {
  x: number;
  y: number;
}

const printPoint = (p: Point) => console.log(`${p.x}, ${p.y}`);
const point = { x: 12, y: 26 };
printPoint(point); // 12, 26

const point2 = { x: 12, y: 26, zzz: 42 };
printPoint(point2); // 12, 26
