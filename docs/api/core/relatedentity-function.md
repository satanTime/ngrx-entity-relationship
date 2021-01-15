---
description: relatedEntity function
---

`relatedEntity` is a **relationship selector factory**,
its call produces a **relationship selector** which can be used within **root selectors** and another suitable **relationship selectors**.

It is useful when the id of the related entity is stored in the parent entity.

```ts
declare function relatedEntity(
  entityStateSelector,
  keyId,
  keyValue,
  ...relationships
);
```

- `entityStateSelector` - is an **entity state selector** of a desired entity.
- `keyId` - a property name in the parent entity which points to the id of the related entity. (User.companyId -> Company.id)
- `keyValue` - a property name in the parent entity where the related entity should be assigned.

  > if `keyId` is an array of ids, then `keyValue` has to be an array of the related entities too.

- `relationships` - is an optional parameter which accepts **relationship selectors** for the related entity.

An example is the `User`. Its model has `companyId`, `company`,
and there is `selectCompanyState` that returns `EntityState<Company>`.
Therefore, if we want a selector which fetches a user with its company it might look like:

```ts
const user = rootEntity(
  selectUserState,
  relatedEntity(
    selectCompanyState,
    'companyId',
    'company',
  ),
);
```
