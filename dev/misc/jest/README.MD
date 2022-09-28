# Jest Mock Functions

https://jestjs.io/docs/mock-function-api

## Functions

### mockClear

- cleans internal state stored in the `mockFn.mock.calls`, `mockFn.mock.instances`, `mockFn.mock.contexts` and `mockFn.mock.results` arrays.
- (eg. mock call count)

### mockReset

- mockClear + destroy mockImplementation / returned values

### mockRestore

- mockClear + mockReset + restore implementation to original non mocked

## Playground

Install with `yarn`

Run `yarn test` in this folder
