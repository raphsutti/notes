// let helloWorld: number
// helloWorld = "hello world!"

interface User {
  name: string;
  id: number;
}
const user: User = {
  name: "Raph",
  id: 0,
};

// OOP
class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}
const user2: User = new UserAccount("Smith", 1);

const getAdminUser = (id: number): User => ({
  name: "random",
  id: 999,
});

const deleteUser = (user: User) => {};
