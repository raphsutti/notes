// Const Enum are not available at runtime
// plain enum are available at runtime
const enum FieldNamesEnum {
  FirstField = "Field One",
  SecondField = "Field Two",
}

let x: FieldNamesEnum;

x = FieldNamesEnum.FirstField;
x = "string"; // Type '"string"' is not assignable to type 'FieldNamesEnum'.
FieldNamesEnum.FirstField = "str"; // Cannot assign to 'FirstField' because it is a read-only property.

const FieldNamesConst = {
  FirstField: "Field One",
  SecondField: "Field Two",
} as const;

type ValueOf<T> = T[keyof T];
let y: ValueOf<typeof FieldNamesConst>;

y = FieldNamesConst.FirstField;
y = "string"; // Type '"string"' is not assignable to type 'ValueOf<{ readonly FirstField: "Field One"; readonly SecondField: "Field Two"; }>'

const FieldNamesConst2 = {
  FirstField: "Field One",
  SecondField: "Field Two",
} as const;

let z: "Field One" | "Field Two";
z = FieldNamesConst2.FirstField;
z = "string"; // FieldNamesConst2
