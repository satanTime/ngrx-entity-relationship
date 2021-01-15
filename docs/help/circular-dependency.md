---
description: A solution how to fix WARNING in Circular dependency detected
---

To fix `WARNING in Circular dependency detected`, simply repeat [the rule #1](../guide/quick.md) and put the created selectors into a separate file.

A file, where we have entity state selectors (anything, but not **root selectors** with relationships): `store.ts`

```ts
export const selectUserState =
  createFeatureSelector<fromUser.State>(
    'users',
  );
export const selectCompanyState =
  createFeatureSelector<fromCompany.State>(
    'companies',
  );
export const selectAddressState =
  createFeatureSelector<fromAddress.State>(
    'addresses',
  );
```

A separate file, where we import all entity state selectors and declare **root selectors** with **relationships**: `selectors.ts`

```ts
import {
  selectUserState,
  selectCompanyState,
  selectAddressState,
} from 'store.ts';

export const selectUser = rootEntity(
  selectUserState,

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

This approach helps to solve circular dependencies.
