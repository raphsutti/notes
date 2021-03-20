const errors = [
  [
    {
      id: 1,
      message: "should NOT have fewer than 1 items",
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

// reduce
const reduced = errors.reduce((acc, error) => [...acc, ...error]);
console.log("reduced: ", reduced);

// flatMap
const flatMapped = errors.flatMap((error) => error);
console.log("flatMapped: ", flatMapped);
