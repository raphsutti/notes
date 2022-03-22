// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

let vAny: any = 10;

vAny.x;
vAny.y;
vAny.z;
vAny();

let vUnknown: unknown = 10;

vUnknown.x;
vUnknown.y;
vUnknown.z;
vUnknown();

interface XYZ {
  x: string;
  y: string;
  z: string;
}
const hasXYZ = (obj: unknown): obj is XYZ =>
  typeof obj === "object" &&
  obj !== null &&
  "x" in obj &&
  "y" in obj &&
  "z" in obj;

if (hasXYZ(vUnknown)) {
  vUnknown.x;
  vUnknown.y;
  vUnknown.z;
}

const newToUpper = (input: string) => {
  input.toUpperCase();
};
newToUpper(vUnknown);
// Type assertion
newToUpper(vUnknown as string);

// User defined type guard
const isString = (input: unknown): input is string => typeof input === "string";
newToUpper(isString(vUnknown) ? vUnknown : "fail");
