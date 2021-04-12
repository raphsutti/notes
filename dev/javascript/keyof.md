# Keyof Type Operator

https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#the-keyof-type-operator

```typescript
type Point = { x: number; y: number };
type P = keyof Point;
//   ^ = type P = keyof Point ("x" "y")

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
//   ^ = type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
//   ^ = type M = string | number'
// Note that in this example, M is string | number — this is because JavaScript object keys are always coerced to a string, so obj[0] is always the same as obj["0"].
```
