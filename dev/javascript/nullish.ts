const getTotalWithTax = (cost: number, tax?: number) => {
  const defaultTax = tax || 0.5;
  return cost + cost * defaultTax;
};
console.log(getTotalWithTax(10, 0)); // 15 - should be 10

const getTotalWithTax2 = (cost: number, tax?: number) => {
  const defaultTax = tax ?? 0.5;
  return cost + cost * defaultTax;
};
console.log(getTotalWithTax2(10, 0)); // 10

const getTotalWithTax3 = (cost: number, tax = 0.5) => {
  return cost + cost * tax;
};
console.log(getTotalWithTax3(10, 0)); // 10
