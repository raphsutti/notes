// Named function
function add(x: number, y: number): number {
  return x + y;
}
// Anonymous function
let myAdd = function (x: number, y: number): number {
  return x + y;
};

// Capture variable outside function
let z = 100;
function addToZ(x: number, y: number) {
  return x + y + z;
}

// Full function type
let myAdd2: (x: number, y: number) => number = function (
  x: number,
  y: number
): number {
  return x + y;
};

// Optional and default parameters
function buildName(firstName = "James", lastName?: string) {
  return firstName + " " + lastName;
}
let result1 = buildName("Bob");
// let result2 = buildName("Bob", "Adams", "Sr.") // error
let result3 = buildName("Bob", "Adams");
let result4 = buildName(undefined, "Adams");

// Rest parameters
function buildName2(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}
let employeeName = buildName2("Joseph", "Samuel", "Lucas", "MacKinzie");
