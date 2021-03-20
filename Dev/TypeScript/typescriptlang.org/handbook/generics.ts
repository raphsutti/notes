// Hello World of Generics

// want the arg type as return type but flexible
function identityNum(arg: number): number {
  return arg;
}

// dont know what the type we are returning and lose info on what the type was
function identityBad(arg: any): any {
  return arg;
}

// type variable - same type use in arg and return
function identity<T>(arg: T): T {
  return arg;
}
let output = identity<string>("myString");
let output2 = identity("myString"); // using type argument inference

// Working with generic type variables
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}

// Generic types
function identity2<T>(arg: T): T {
  return arg;
}
let myIdentity: <T>(arg: T) => T = identity;
let myIdentity2: <U>(arg: U) => U = identity; // Does not have to be T
let myIdentity3: { <T>(arg: T): T } = identity; // Call signature of object literal type

// generic interface
interface GenericIdentityFn {
  <T>(arg: T): T;
}
// or
interface GenericIdentityFn2<T> {
  (arg: T): T;
}
function identity4<T>(arg: T): T {
  return arg;
}
let myidentity4: GenericIdentityFn = identity;

// Generic classes
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};
console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));

// Generic Constraints
interface Lengthwise {
  length: number;
}
function loggingIdentity2<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
// loggingIdentity2(3) // Error - generic function now constrained to number
loggingIdentity2({ length: 10, value: 3 });

// Using type parameters in generic constraints
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
let x = { a: 1, b: 2, c: 3, d: 4 };
getProperty(x, "a");
// getProperty(x, "m") // Error - key "m" doesnt exist in x

// Using class types in generics
function create<T>(c: { new (): T }): T {
  return new c();
}

class BeeKeeper {
  hasMask: boolean;
}
class ZooKeeper {
  nametag: string;
}
class Animal {
  numLegs: number;
}
class Bee extends Animal {
  keeper: BeeKeeper;
}
class Lion extends Animal {
  keeper: ZooKeeper;
}
function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}
createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
