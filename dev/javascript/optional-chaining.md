# Optional chaining

Access properties that are possibly undefined without doing messy verbose ternary checks

We have this type
```typescript
type SerializationOptions = {
  formatting?: {
    // all properties optional
    indent?: number;
    "indent-level"?: number;
    getIndent?: () => number;
  };
};
```

Before we had optional chaining, we had to check for undefined property before assigning
```typescript
// This is super messy
const serializeJSON_bad = (value: any, options?: SerializationOptions) => {
  const indent = options
    ? options.formatting
      ? options.formatting.indent
      : undefined
    : undefined;
  return JSON.stringify(value, null, indent);
};
```

Optional chaining is much cleaner
```typescript
// This is better
const serializeJSON_good = (value: any, options?: SerializationOptions) => {
  const indent = options?.formatting?.indent; // property
  const indentLevel = options?.formatting?.["indent-level"]; // index notation or eg. array
  const getIndent = options?.formatting?.getIndent?.(); // function
  return JSON.stringify(value, null, indent);
};
```

Now we can call the function
```typescript
const json = serializeJSON_good(
  {
    name: "John",
    twitter: "jdude",
  },
  {
    formatting: {
      indent: 2,
    },
  }
);

console.log(json);
```
