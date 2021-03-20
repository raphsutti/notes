const foo = {name: 'tom', age:30, nervous:false }
const bar = {name: 'dick', age:40, nervous:false }
const baz = {name: 'harry', age:50, nervous:true }

// Bad
console.log(foo)

// Good
console.log({foo, bar, baz})

// Chrome
console.log('%c Special colours in chrome debugger!', 'color:orange;')
console.log('\u001b[1;36mSpecial colours in vscode!')
console.log( "\u001b[1;31m Red message" );
console.log( "\u001b[1;32m Green message" );
console.log( "\u001b[1;33m Yellow message" );
console.log( "\u001b[1;34m Blue message" );
console.log( "\u001b[1;35m Purple message" );
console.log( "\u001b[1;36m Cyan message" );

// Works in Chrome
console.table([foo,bar,baz])