# Keyof Type Operator

https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#the-keyof-type-operator

- Takes an object type and produces a string or numeric literal union of its keys

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


Examples

```typescript
interface Props {
  id: number
  name: string
  lastName: string
}

type foo = {
  [K in Exclude<keyof Props, 'lastName'>]: boolean;
}
// type foo = { id: boolean; name: boolean; }
```

Instead of using `[K in ...]: boolean`, we can also just generate `Record` key-value type
```typescript
type bar = Record<Exclude<keyof Props, 'lastName'>, boolean>
// type bar = { id: boolean; name: boolean; }
```
