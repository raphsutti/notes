# Type Guard

https://basarat.gitbook.io/typescript/type-system/typeguard

```typescript
// typeof
const doSomething = (x: number | string) => {
    if (typeof x === 'string') { // x is a string inside this block
        return x.substr(1)
    }
    return x.toString() // x is a number outside
}

// instanceof
class Foo {
    foo = 123;
    common = '123';
}
class Bar {
    bar = 123;
    common = '123';
}

const doStuff = (arg: Foo | Bar) => {
    if (arg instanceof Foo) {
        return arg.foo
    }
    return arg.bar
}

// in
interface A {
    x: number;
}
interface B {
    y: string;
}

const doStuff2 = (q: A | B) => {
    if ('x' in q) {
        return q.x
    }
    return q.y
}

// Literal type guard
type Foo2 = {
  kind: 'foo', // Literal type 
  foo: number
}
type Bar2 = {
  kind: 'bar', // Literal type 
  bar: number
}

function doStuff3(arg: Foo2 | Bar2) {
    if (arg.kind === 'foo') { // Check value of a shared property `kind`
        console.log(arg.foo); // OK
    }
    else {  // MUST BE Bar!
        console.log(arg.bar); // OK
    }
}

// User defined type guards
interface Foo4 {
    foo: number;
    common: string;
}

interface Bar4 {
    bar: number;
    common: string;
}

/**
 * User Defined Type Guard!
 */
const isFoo = (arg: any): arg is Foo4 => {
    return arg.foo !== undefined;
}

const doStuff4 = (arg: Foo4 | Bar4) => {
    if (isFoo(arg)) {
        console.log(arg.foo)
    }
    else { // MUST BE Bar!
        console.log(arg.bar)
    }
}
```
