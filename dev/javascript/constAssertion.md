# Const Assertion

https://blog.logrocket.com/const-assertions-are-the-killer-new-typescript-feature-b73451f35802/

Literal types instead of broader type eg. string

- no literal types in that expression should be widened (e.g. no going from “hello” to string)
- object literals get readonly properties
- array literals become readonly tuples

```typescript
let obj = {
  x: 10,
  y: [20, 30],
  z: {
    a:
      {  b: 42 }
  } 
} as const;
```

Corresponds to

```typescript
let obj: {
  readonly x: 10;
  readonly y: readonly [20, 30];
  readonly z: {
    readonly a: {
      readonly b: 42;
    };
  };
};
```
