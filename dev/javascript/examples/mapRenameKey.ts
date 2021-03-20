// Rename key id -> ssid using map
const people = [
  { id: 123, name: "smith" },
  { id: 456, name: "jane" },
  { id: 789, name: "tyrone" },
];

const newPeople = people.map(({ id, ...obj }) => ({
  ...obj,
  ssid: id,
}));

console.log(people);
// [{ "id": 123, "name": "smith" }, { "id": 456, "name": "jane" }, { "id": 789, "name": "tyrone" }]
// people did not change after map()

console.log(newPeople);
// [{ "name": "smith", "ssid": 123 }, { "name": "jane", "ssid": 456 }, { "name": "tyrone", "ssid": 789 }]

const obj = { firstname: "john", age: 12 };

// Rename one object key firstname -> nickname
const { firstname, ...mappedObj } = { ...obj, nickname: obj.firstname };
console.log(mappedObj);
// {  "age": 12,  "nickname": "john"  }
