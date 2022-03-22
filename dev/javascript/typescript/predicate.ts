const arr = [123, "123", undefined];

const isString = (input: unknown): input is string => typeof input === "string";

const stringsOnly = arr.filter((i) => isString(i)); // Type is const filtered: (string | number | undefined)[] 😐
console.log(stringsOnly);

const stringsOnlyPredicate = arr.filter((i): i is string => isString(i)); // Type is const stringsOnlyPredicate: string[] 😁
console.log(stringsOnlyPredicate);

const stringsOnlyNew = arr.flatMap((i) => (isString(i) ? [i] : [])); // Type is const stringsOnlyNew: string[] 😁
console.log(stringsOnlyNew);
