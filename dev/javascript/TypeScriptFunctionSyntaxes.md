# TypeScript Function Syntaxes

https://kentcdodds.com/blog/typescript-function-syntaxes

## When do we use `:` or `=>`

```typescript
// Simple type for a function, use =>
type FnType = (arg: ArgType) => ReturnType;

// Every other time, use :
type FnAsObjType = {
  (arg: ArgType): ReturnType;
};
interface InterfaceWithFn {
  fn(arg: ArgType): ReturnType;
}

const fnImplementation = (arg: ArgType): ReturnType => {
  /* implementation */
};
```

## Function declarations

```typescript
// inferred return type
function sum(a: number, b: number) {
  return a + b;
}

// defined return type
function sum(a: number, b: number): number {
  return a + b;
}
```

## Function expressions

```typescript
// named function expression
const sum = function sum(a: number, b: number): number {
  return a + b;
};

// annonymous function expression
const sum = function (a: number, b: number): number {
  return a + b;
};

// arrow function
const sum = (a: number, b: number): number => {
  return a + b;
};

// implicit return
const sum = (a: number, b: number): number => a + b;
// implicit return of an object requires parentheses to disambiguate the curly braces
const sum = (a: number, b: number): { result: number } => ({ result: a + b });
```

Type annotation

```typescript
// You can add type annotations and function will assume those types
const sum: (a: number, b: number) => number = (a, b) => a + b;

// And you can extract that type:
type MathFn = (a: number, b: number) => number;
const sum: MathFn = (a, b) => a + b;

// Or you can use the object type syntax:
type MathFn = {
  (a: number, b: number): number;
};
const sum: MathFn = (a, b) => a + b;

// Which can be useful if you want to add a typed property to the function:
type MathFn = {
  (a: number, b: number): number;
  operator: string;
};
const sum: MathFn = (a, b) => a + b;
sum.operator = "+";

// This can also be done with an interface:
interface MathFn {
  (a: number, b: number): number;
  operator: string;
}
const sum: MathFn = (a, b) => a + b;
sum.operator = "+";

// Or use declare to create the type and use typeof to assign that type
declare function MathFn(a: number, b: number): number;
declare namespace MathFn {
  let operator: "+";
}
const sum: typeof MathFn = (a, b) => a + b;
sum.operator = "+";
```

Preference here is type or interface

## Optional/default params

```typescript
// Optional
const sum = (a: number, b?: number): number => a + (b ?? 0);

// Default
const sum = (a: number, b: number = 0): number => a + b;
sum(1); // results in 1
sum(2, undefined); // results in 2

// TypeScript treats default as optional as:
const sum = (a: number, b: number | undefined = 0): number => a + b;
```

## Rest params

Collect the rest of the arguments

```typescript
const sum = (a: number = 0, ...rest: Array<number>): number => {
  return rest.reduce((acc, n) => acc + n, a);
};
// extract the type
type MathFn = (a?: number, ...rest: Array<number>) => number;
const sum: MathFn = (a = 0, ...rest) => rest.reduce((acc, n) => acc + n, a);
```

## Async

```typescript
const sum = async (a: number, b: number): Promise<number> => a + b;
async function sum(a: number, b: number): Promise<number> {
  return a + b;
}
```

## Generics

```typescript
function arrayify2<Type>(a: Type): Array<Type> {
  return [a];
}
const arrayify = <Type extends unknown>(a: Type): Array<Type> => [a];
```

## Type guards

```javascript
// Array<number | undefined>
const arrayWithFalsyValues = [1, undefined, 0, 2];

// In regular JavaScript you can do:
// Array<number | undefined>
const arrayWithoutFalsyValues = arrayWithFalsyValues.filter(Boolean);
```

```typescript
type FalsyType = false | null | undefined | "" | 0;
function typedBoolean<ValueType>(
  value: ValueType
): value is Exclude<ValueType, FalsyType> {
  return Boolean(value);
}

// And with that we can do this:
// Array<number>
const arrayWithoutFalsyValues = arrayWithFalsyValues.filter(typedBoolean);
111;
```
