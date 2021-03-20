// Bad
const orders = [10,60,34,70,102,334,23,492]
let total = 0
const withTax = []
const highValue = []
for(let i=0; i< orders.length; i++){
    // Reduce
    total += orders[i]
    // Map
    withTax.push(orders[i] * 1.1)

    // Filter
    if (orders[i] > 100 ){
        highValue.push(orders[i])
    }
}
console.log({total, withTax, highValue})

// Good
// Reduce
const total = orders.reduce((acc, cur) => acc + cur)

// Map
const withTax = orders.map(v => v * 1.1)

// Filter
const highValue = orders.filter(v => v > 100)

console.log({total, withTax, highValue})