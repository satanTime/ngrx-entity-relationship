---
title: Normalizing linear data
description: ngrx-entity-relationship supports normalization of linear data structures and handles them via ReduceFlat and reduceFlat action
sidebar_label: Normalizing linear data
---

`reduceFlat` action helps to add data from a flat response to the store.

Imagine that a backend returns the next flat shape:

```json
{
  "users": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Smith",
      "companyId": "1"
    }
  ],
  "companies": [
    {
      "id": "1",
      "name": "Magic",
      "adminId": "2",
      "addressId": "1"
    }
  ],
  "addresses": [
    {
      "id": "1",
      "street": "Main st.",
      "city": "Town",
      "country": "Land"
    }
  ]
}
```

There is a selector that fetches this data from the store like that: a user with its company and the address of the company.

We only need to specify related bucket names from response as `flatKey` in selector's meta:

```ts
export const selectUser = rootEntity(
  selectUserState,
  {
    // here we go
    flatKey: 'users',
  },
  relatedEntity(
    selectCompanyState,
    'companyId',
    'company',
    {
      // here we go
      flatKey: 'companies',
    },
    relatedEntity(
      selectAddressState,
      'addressId',
      'address',
      {
        // here we go
        flatKey: 'addresses',
      },
    ),
  ),
);
```

Then the store can be updated by dispatching the `reduceFlat` action:

```ts
// Redux
store.dispatch(
  reduceFlat({
    data: response,
    selector: selectUser,
  }),
);
```

```ts
// NGRX
this.store.dispatch(
  reduceFlat({
    data: response,
    selector: selectUser,
  }),
);
// or
this.store.dispatch(
  new ReduceFlat(response, selectUser),
);
```

[`ngrxEntityRelationshipReducer`](reducer.md) will catch this action, parse the data and put it into the store like that:

```ts
const rootState = {
  users: {
    ids: ['1'],
    entities: {
      '1': {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        companyId: '1',
      },
    },
  },
  companies: {
    ids: ['1'],
    entities: {
      '1': {
        id: '1',
        name: 'Magic',
        adminId: '2',
        addressId: '1',
      },
    },
  },
  addresses: {
    existingIds: ['1'],
    byIds: {
      '1': {
        id: '1',
        street: 'Main st.',
        city: 'Town',
        country: 'Land',
      },
    },
  },
};
```
