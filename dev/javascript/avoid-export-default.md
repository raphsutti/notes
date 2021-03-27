# Avoid Export Default

https://basarat.gitbook.io/typescript/main-1/defaultisbad

## Example

foo.ts
```typescript
class Foo {
}
export default Foo;
```

You can import the class like this
bar.ts
```typescript
import Foo from "./foo";
```

There a few maintainability concerns with export default
- refactoring `Foo` will not rename it in `bar.ts`
- You can't export more stuff from `foo.ts` without juggling import syntax


It is much better to use simple export + destructured import

foo.ts
```typescript
export class Foo {
}
```

bar.ts
```typescript
import { Foo } from "./foo";
```

## Advantages of avoiding export default

1. Poor discoverability - using intellisense to explore a module
2. Autocomplete `import {/*here*/} from "./foo";` works
3. CommonJS interop - dont have to use `const {default} = require('module/foo');`
4. Typo protection
5. TypeScript auto-import - quick fixes works better
6. Re-exporting from npm packages forces you to name default export manually
7. Require an extra line to `export default foo`
8. Dynamic imports - dont have to have `default` but use dynamic name instead 

```typescript
const HighCharts = await import('https://code.highcharts.com/js/es-modules/masters/highcharts.src.js');
HighCharts.default.chart('container', { ... }); // Notice `.default`
```
vs
```typescript
const {HighCharts} = await import('https://code.highcharts.com/js/es-modules/masters/highcharts.src.js');
HighCharts.chart('container', { ... }); // Notice `.default`
```
