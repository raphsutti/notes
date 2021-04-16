# Generate types from data

```typescript
const currencies = {
  AUD: "Australian Dollar",
  USD: "United States Dollar",
  NZD: "New Zealand DOllar"
}

type CurrencyCode = keyof typeof currencies

const selectCurrency: CurrencyCode = "AUD" //AUD | USD | NZD
```
