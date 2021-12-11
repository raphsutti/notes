```javascript
const newArray = new Array(5).fill(1);
console.log(newArray); // [ 1, 1, 1, 1, 1 ]

const newArray2 = [...new Array(5)].fill(1);
console.log(newArray2); // [ 1, 1, 1, 1, 1 ]

const newArray3 = Array.from({ length: 5 }, () => 1);
console.log(newArray3); // [ 1, 1, 1, 1, 1 ]
```
