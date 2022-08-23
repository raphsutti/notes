interface Product {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly revision: string;
  readonly metadata: Metadata;
  readonly upgrades?: ProductReference[];
  readonly features: Feature[];
  readonly displayMetadata?: DisplayMetadata;
}
interface ProductReference {
  readonly id: string;
  readonly revision: string;
}
interface Metadata {
  readonly version: string;
}
interface DisplayMetadata {
  readonly frequency?: string;
  readonly name?: string;
}
interface Feature {
  metadata: Metadata;
  id: string;
  name: string;
  type: string;
  properties?: Record<string, unknown>;
}

const productRefs = [
  { id: "x", revision: "1" },
  { id: "2", revision: "1" },
];
const productCatalog = [
  {
    id: "1",
    name: "AmazingProduct",
    type: "AmazingProduct",
    description: "Amazing Product",
    revision: "1",
    metadata: {
      version: "0.1",
    },
    upgrades: [
      {
        id: "2",
        revision: "1",
      },
    ],
    features: [
      {
        id: "1",
        name: "Amazing",
        type: "Amazing",
        metadata: {
          version: "1",
        },
      },
    ],
  },
  {
    id: "1",
    name: "AmazingProduct",
    type: "AmazingProduct",
    description: "Amazing Product",
    revision: "1",
    metadata: {
      version: "0.1",
    },
    upgrades: [
      {
        id: "2",
        revision: "1",
      },
    ],
    features: [
      {
        id: "1",
        name: "Amazing",
        type: "Amazing",
        metadata: {
          version: "1",
        },
      },
    ],
  },
  {
    id: "2",
    name: "BrilliantProduct",
    type: "BrilliantProduct",
    description: "Amazing Product",
    revision: "1",
    metadata: {
      version: "0.1",
    },
    upgrades: [
      {
        id: "2",
        revision: "1",
      },
    ],
    features: [
      {
        id: "1",
        name: "Amazing",
        type: "Amazing",
        metadata: {
          version: "1",
        },
      },
    ],
  },
];

// REDUCE
// const result = productRefs.reduce((products, curr) => {
//     const foundProduct = productCatalog.find(
//       (product) => product.id === curr.id && product.revision === curr.revision,
//     );
//     if (foundProduct) {
//       products.push(foundProduct);
//     }
//     return products;
//   }, [] as Product[]);

// FLATMAP - find
// const result = productRefs.flatMap(({id, revision}) => {
//   const foundProduct = productCatalog.find(product => product.id === id && product.revision === revision)
//   return foundProduct ? [foundProduct] : []
// })

// FLATMAP - filter
const result: Product[] = productRefs.flatMap(({ id, revision }) =>
  productCatalog.filter(
    (product) => product.id === id && product.revision === revision
  )
);

console.log(result);
