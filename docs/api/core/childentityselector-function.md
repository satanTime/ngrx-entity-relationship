---
description: childEntitySelector function
---

`childEntitySelector` is a function which creates a predefined **relationship selector factory**.
The goal here is to simply the process of creating **relationship selectors** with [`childEntity`](#childentity-function).

```ts
declare function childEntitySelector(
  entityStateSelector,
  keyId,
  keyValue,
);
```

It's parameters are the same as [`childEntity`](#childentity-function) has, but without relationships.

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
