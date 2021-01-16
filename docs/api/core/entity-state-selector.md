---
description: Information about how an entity state selector should look like in order to be used with ngrx-entity-relationship
---

An **entity state selector** can be:

- an object which contains selectors `{collection: selector, id: selector}`
- a function that returns [`EntityState<T>`](https://ngrx.io/api/entity/EntityState) like in **NGRX**
- an instance of [`EntityCollectionService<T>`](https://ngrx.io/api/data/EntityCollectionService) like in **NGRX**
- an instance of [`EntityCollectionServiceBase<T>`](https://ngrx.io/api/data/EntityCollectionServiceBase) like in **NGRX** 

The first case is useful when the `id` key of an entity is not `id`, but another one: `Id`, `uuid`, etc.
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
