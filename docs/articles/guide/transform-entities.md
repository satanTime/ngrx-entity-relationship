---
title: Transform entities
description: A guide how to transform an entity object with relationships to a class instance in Redux and NGRX
sidebar_label: Transform entities
---

[`rootEntity`](../api/core/rootentity-function.md) and [`rootEntitySelector`](../api/core/rootentityselector-function.md)
support an optional transformation callback that has the next type: `<F, T>(entity: F) => T`.

It is useful, if we need a post transformation of a selected entity, for example, to a class instance,
in order to extend its functionality.

The callback should be specified as the latest parameter, but before definition of relationships.
The transformation happens once on the final root entity when all relationships have been already fulfilled.

```ts
const entityUser = rootEntitySelector(
  selectUserState,
  user => new UserClass(user),
);

export const selectUser = rootEntity(
  selectUserState,
  user => new UserClass(user),
  relatedEntity(
    selectCompanyState,
    'companyId',
    'company',
    relatedEntity(
      selectAddressState,
      'addressId',
      'address',
    ),
  ),
);
```

Profit. Now all selected users will be instances of `UserClass`.
