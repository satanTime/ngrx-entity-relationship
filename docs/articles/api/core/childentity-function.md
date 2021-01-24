---
title: childEntity
description: Information about childEntity function and how to create relationship selectors
sidebar_label: childEntity
---

`childEntity` is a **relationship selector factory**,
its call produces a **relationship selector** which can be used within **root selectors** and another suitable **relationship selectors**.

It is useful when the parent entity does not have the id of the related entity, but the related entity has the id of the parent entity.

```ts
declare function childEntity(
  entityStateSelector,
  keyId,
  keyValue,
  ...relationships
);
```

- `entityStateSelector` - is an [**entity state selector**](entity-state-selector.md) of a desired entity.
- `keyId` - a property name in the related entity which points to the id of the parent entity, `addressId` from `Address.id -> Company.addressId`.
- `keyValue` - a property name in the parent entity where the related entity should be assigned, `company` from `Address.company`.
- `relationships` - is an optional parameter which accepts **relationship selectors** for the related entity.

An example is the `Address`. Its model has `company`, but does not have `companyId`.
However, `Company` entity has `addressId`.
Therefore, if we want a **root selector** which fetches an address with its company it might look like:

```ts
const address = rootEntity(
  selectAddressState,
  childEntity(
    selectCompanyState,
    'addressId',
    'company',
  ),
);
```
