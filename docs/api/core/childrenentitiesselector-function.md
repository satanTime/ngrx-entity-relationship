---
description: childrenEntitiesSelector function
---

`childrenEntitiesSelector` is a function which creates a predefined **relationship selector factory**.
The goal here is to simply the process of creating **relationship selectors** with [`childrenEntities`](#childrenentities-function).

```ts
declare function childrenEntitiesSelector(
  selector,
  keyId,
  keyValue,
);
```

It's parameters are the same as [`childrenEntities`](#childrenentities-function) has, but without relationships.

```ts
const company = rootEntitySelector(
  selectCompanyState,
);
const companyStaff = childrenEntitiesSelector(
  selectUserState,
  'companyId',
  'staff',
);

// later.
const company1 = company(
  selectUserState(),
);

// the same as.
const company2 = rootEntity(
  selectCompanyState,
  childrenEntities(
    selectUserState,
    'companyId',
    'staff',
  ),
);
```
