const errors2 = [
  [
    {
      id: 1,
      message: "should NOT have foo",
    },
    {
      id: 2,
      message: "second error",
    },
  ],
  [
    {
      id: 1,
      message: "another error",
    },
  ],
];

const newField = {
  type: "failure!",
};

// reduce
const reduced2 = errors2.reduce((acc, error) => [...acc, ...error]);
console.log("reduced: ", reduced2);

// flatMap
const flatMapped2 = errors2.flatMap((error) => error);
// add new field
const flatMappedResult = flatMapped2.map((error) => ({
  ...error,
  ...newField,
}));
console.log("flatMapped: ", flatMappedResult);
