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

const hasXYZ = (
  obj: unknown
): obj is {
  x: any;
  y: any;
  z: any;
} =>
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
newToUpper(vUnknown as string);

const isString = (input: unknown): input is string => typeof input === "string";
newToUpper(isString(vUnknown) ? vUnknown : "");
