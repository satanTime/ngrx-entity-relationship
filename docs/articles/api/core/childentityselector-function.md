---
title: childEntitySelector
description: Information about childEntitySelector function and how to create preconfigured relationship selector factories based on childEntity
sidebar_label: childEntitySelector
---

`childEntitySelector` is a function which creates a predefined **relationship selector factory**.
Its goal is to simply the process of creating **relationship selectors** with [`childEntity`](childentity-function.md).

```ts
declare function childEntitySelector(
  entityStateSelector,
  keyId,
  keyValue,
);
```

Its parameters are the same as [`childEntity`](childentity-function.md) has, but without relationships.

```ts
const address = rootEntitySelector(
  selectAddressState,
);
const addressCompany = childEntitySelector(
  selectCompanyState,
  'addressId',
  'company',
);

// later.
const address1 = address(
  addressCompany(),
);

// the same as.
const address2 = rootEntity(
  selectAddressState,
  childEntity(
    selectCompanyState,
    'addressId',
    'company',
  ),
);
```
