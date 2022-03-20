const user = {
  name: "foo",
  age: 28,
};

function stringifyProp(object: { name: string; age: number }) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, String(value)])
  );
}

const userWithStringProps = stringifyProp(user); // {name:'foo', age: '28'}
