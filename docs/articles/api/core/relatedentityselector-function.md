---
title: relatedEntitySelector
description: Information about relatedEntitySelector function and how to create preconfigured relationship selector factories based on relatedEntity
sidebar_label: relatedEntitySelector
---

`relatedEntitySelector` is a function which creates a predefined **relationship selector factory**.
Its goal is to simply the process of creating **relationship selectors** with [`relatedEntity`](relatedentity-function.md).

```ts
declare function relatedEntitySelector(
  entityStateSelector,
  keyId,
  keyValue,
);
```

Its parameters are the same as [`relatedEntity`](relatedentity-function.md) has, but without relationships.

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
