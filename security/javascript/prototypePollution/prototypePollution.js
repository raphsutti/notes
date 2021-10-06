const quiz = (obj) => {
  for (let name of Object.keys(obj)) {
    delete obj[name];
  }
  if (obj.win) {
    return "You win!";
  }
};

// Solution 1
console.log(quiz({ __proto__: { win: "maybe?" } })); 

// Solution 2
let obj = {};
Object.defineProperty(obj, "win", { value: true });

console.log(obj); 
console.log(quiz(obj)); 
