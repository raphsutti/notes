# GraphQL Resolvers: Best Practices

https://medium.com/paypal-tech/graphql-resolvers-best-practices-cd36fdbcef55

### Schema

```gql
type Query {
  event(id: ID!): Event
}

type Event {
  title: String
  photoUrl: String
}
```

### Resolver

```typescript
export default {
  Query: {
    event: (root, { id }) => ({ id }),
  },
  Event: {
    title: async ({ id }) => {
      const { title } = await getEvent(id);

      return title;
    },
    photoUrl: async ({ id }) => {
      const { photoUrl } = await getEvent(id);

      return photoUrl;
    },
    attendees: async ({ id }) => await getAttendeesFromEvent(id),
  },
};
```
