---
description: relatedEntitySelector function
---

`relatedEntitySelector` is a function which creates a predefined **relationship selector factory**.
The goal here is to simply the process of creating **relationship selectors** with [`relatedEntity`](#relatedentity-function).

```ts
declare function relatedEntitySelector(
  entityStateSelector,
  keyId,
  keyValue,
);
```

It's parameters are the same as [`relatedEntity`](#relatedentity-function) has, but without relationships.

```ts
const user = rootEntitySelector(
  selectUserState,
);
const userCompany = relatedEntitySelector(
  selectCompanyState,
  'companyId',
  'company',
);

// later.
const user1 = user(
  userCompany(),
);

// the same as.
const user2 = rootEntity(
  userSelector,
  relatedEntity(
    companySelector,
    'companyId',
    'company',
  ),
);
```
