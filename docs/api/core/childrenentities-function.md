---
description: Information about childrenEntities function and how to create relationship selectors
---

`childrenEntities` is a **relationship selector factory**,
its call produces a **relationship selector** which can be used within **root selectors** and another suitable **relationship selectors**.

It is useful when the parent entity has a relationship to an array of entities and does not have ids of them, but the related entity has the id of the parent entity.

```ts
declare function childrenEntities(
  entityStateSelector,
  keyId,
  keyValue,
  ...relationships
);
```

- `entityStateSelector` - is an [**entity state selector**](entity-state-selector.md) of a desired entity.
- `keyId` - a property name in the related entity which points to the id of the parent entity, `companyId` from `Company.id -> User.companyId`.
- `keyValue` - a property name in the parent entity where the array of related entities should be assigned, `stuff` from `Company.stuff`.
- `relationships` - is an optional parameter which accepts **relationship selectors** for the related entities.

An example is the `Company`. Its model has `staff`, but does not have `staffId`.
However, `User` entity has `companyId`.
Therefore, if we want a **root selector** which fetches a company with its staff it might look like:

```ts
const company = rootEntity(
  selectCompanyState,
  childrenEntities(
    selectUserState,
    'companyId',
    'staff',
  ),
);
```
