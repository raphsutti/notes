// https://blog.logrocket.com/how-to-use-type-guards-typescript/

// instanceof
interface Accessory {
  brand: string;
}
class Necklace implements Accessory {
  brand: string;
  kind: string;
  constructor(brand: string, kind: string) {
    this.brand = brand;
    this.kind = kind;
  }
}
class Bracelet implements Accessory {
  brand: string;
  year: number;
  constructor(brand: string, year: number) {
    this.brand = brand;
    this.year = year;
  }
}
const getRandomAccessory = () => {
  return Math.random() < 0.5
    ? new Bracelet("cartier", 2021)
    : new Necklace("choker", "TASAKI");
};
let Accessory = getRandomAccessory();
if (Accessory instanceof Bracelet) {
  console.log(Accessory.year); // Bracelet
}
if (Accessory instanceof Necklace) {
  console.log(Accessory.kind); // Necklace
}

// typeof
const StudentId = (x: string | number) => {
  if (typeof x == "string") {
    console.log(x); // type is string
  }
  if (typeof x === "number") {
    console.log(x); // type is number
  }
};
StudentId("446"); //prints Student
StudentId(446); //prints Id

// in
"house" in { name: "test", house: { parts: "door" } }; // => true
"house" in { name: "test", house: { parts: "windows" } }; // => true
"house" in { name: "test", house: { parts: "roof" } }; // => true
"house" in { name: "test" }; // => false
"house" in { name: "test", house: undefined }; // => true

interface Pupil {
  id: string;
}
interface Adult {
  ssn: number;
}
interface Person {
  name: string;
  age: number;
}
let person: Pupil | Adult | Person = {
  name: "Britney",
  age: 6,
};
const getIdentifier = (person: Pupil | Adult | Person) => {
  if ("name" in person) {
    return person.name; // Person
  }
  if ("id" in person) {
    return person.id; // Pupil
  }
  return person.ssn; // Adult
};

// equality narrowing
const getValues = (a: number | string, b: string) => {
  if (a === b) {
    // this is where the narrowing takes place. narrowed to string
    console.log(typeof a); // string
  } else {
    // if there is no narrowing, type remains unknown
    console.log(typeof a); // number or string
  }
};

// custom type guard with predicate
interface Necklace {
  kind: string;
  brand: string;
}
interface bracelet {
  brand: string;
  year: number;
}
type Accessory2 = Necklace | bracelet;

const isNecklace = (b: Accessory2): b is Necklace => {
  return (b as Necklace).kind !== undefined;
};
const necklace: Accessory2 = { kind: "Choker", brand: "TASAKI" };
const bracelet: Accessory2 = { brand: "Cartier", year: 2021 };
console.log(isNecklace(bracelet)); // false
console.log(isNecklace(necklace)); // true
