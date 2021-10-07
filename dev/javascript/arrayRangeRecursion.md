```javascript
function rangeOfNumbers(startNum, endNum) {
  if (endNum < startNum) {
    return [];
  } else {
    const result = rangeOfNumbers(startNum, endNum - 1);
    result.push(endNum);
    return result;
  }
}

console.log(rangeOfNumbers(2, 5)); // [ 2, 3, 4, 5 ]
```
