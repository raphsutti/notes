const user = {
  name: "foo",
  age: 28,
};

// Stringify props
// JS
function stringifyProp(object: { name: string; age: number }) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, String(value)])
  );
}

const userWithStringProps = stringifyProp(user); // {name:'foo', age: '28'}

// Types
type User = {
  name: string;
  age: number;
};

type StringifyProp<T> = {
  [K in keyof T]: string;
};

type UserWithStringProps = StringifyProp<User>; // { name: string; age: string; }

// Filter out props
// JS
function filterNonStringProp(object: { name: string; age: number }) {
  return Object.fromEntries(
    Object.entries(object).filter(([_key, value]) => typeof value === "string")
  );
}

const filteredUser = filterNonStringProp(user); // {name: 'foo'}

// Types
type User2 = {
  name: string;
  age: number;
};

type FilterStringProp<T> = {
  [K in keyof T as T[K] extends string ? K : never]: string;
};

type FilteredUser = FilterStringProp<User2>; // { name: string }

// String replace
// JS
const str = "foo-bar".replace(/foo-*/, "");
console.log(str); // 'bar'

// Types
type Str = "foo-bar";
type Bar = Str extends `foo-${infer rest}` ? rest : never; // 'bar'
