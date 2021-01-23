---
title: childrenEntitiesSelector
description: Information about childrenEntitiesSelector function and how to create preconfigured relationship selector factories based on childrenEntities
sidebar_label: childrenEntitiesSelector
---

`childrenEntitiesSelector` is a function which creates a predefined **relationship selector factory**.
Its goal is to simply the process of creating **relationship selectors** with [`childrenEntities`](childrenentities-function.md).

```ts
declare function childrenEntitiesSelector(
  selector,
  keyId,
  keyValue,
);
```

Its parameters are the same as [`childrenEntities`](childrenentities-function.md) has, but without relationships.

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
