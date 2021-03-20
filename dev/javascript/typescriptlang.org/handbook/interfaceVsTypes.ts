// 1. Objects and functions - syntatical
interface Point {
  x: number;
  y: number;
}
interface SetPoint {
  (x: number, y: number): void;
}

type TPoint = {
  x: number;
  y: number;
};
type TSetPoint = (x: number, y: number) => void;

// 2. Other types - type alias can be used for other types such as primitives
// primitive
type Name = string;
// object
type PartialPointX = { x: number };
type PartialPointY = { y: number };
// union
type PartialPoint = PartialPointX | PartialPointY;
// tuple
type Data = [number, string];

// 3. Extend - syntactical
interface IPartialPointX {
  x: number;
}
type TPartialPointX = { x: number };

// Interface extends interface
interface IPoint extends IPartialPointX {
  y: number;
}
// Interface extends type
interface IPoint2 extends TPartialPointX {
  y: number;
}

// Type extends type
type TPoint2 = TPartialPointX & { y: number };
// Type extends interface
interface TPartialPointX3 {
  x: number;
}
type TPoint3 = IPartialPointX & { y: number };

// 4. Implements
interface Point {
  x: number;
  y: number;
}
class SomePoint implements Point {
  x = 1;
  y = 2;
}

type Point2 = {
  x: number;
  y: number;
};
class SomePoint2 implements Point2 {
  x = 1;
  y = 2;
}

type UPartialPoint = { x: number } | { y: number };
// Error - can not implement a union type
// class SomePartialPoint implements UPartialPoint {
//   x = 1;
//   y = 2;
// }

// 5. Declaration merging
// These two declarations become:
// interface Point { x: number; y: number; }
interface Point {
  x: number;
}
interface Point {
  y: number;
}
const point: Point = { x: 1, y: 2 };
