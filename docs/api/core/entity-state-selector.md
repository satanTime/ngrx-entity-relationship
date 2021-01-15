---
description: Entity state selector
---

An **entity state selector** can be:

- a function that returns `EntityState<T>`
- an instance of `EntityCollectionService<T>`
- an instance of `EntityCollectionServiceBase<T>`
- an object `{collection: selector, id: selector}`

The last case is useful when the `id` key of an entity isn't `id`, but another one: `Id`, `uuid`, etc.
Then you can define here the key name, or a function which returns its value from an entity.

```ts
const selector1 = {
  collection: createFeatureSelector('users'),
  id: 'Id',
};
const selector2 = {
  collection: state => state.companies,
  id: 'uuid',
};
const selector3 = {
  collection: stateKeys(
    createFeatureSelector('addresses'),
    'byIds',
    'existingIds',
  ),
  id: entity => entity.uuid,
};
```
