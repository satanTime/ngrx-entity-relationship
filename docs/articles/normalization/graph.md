---
title: Normalizing graph data
description: ngrx-entity-relationship supports normalization of graph data structures and handles them via ReduceGraph and reduceGraph action
sidebar_label: Normalizing graph data
---

`reduceGraph` action helps to add to store data from a graph response.

Imagine a backend returns the next nested shape of user (like **GraphQL** does):

```json
{
  "id": "1",
  "firstName": "John",
  "lastName": "Smith",
  "companyId": "1",
  "company": {
    "id": "1",
    "name": "Magic",
    "adminId": "2",
    "addressId": "1",
    "address": {
      "id": "1",
      "street": "Main st.",
      "city": "Town",
      "country": "Land"
    }
  }
}
```

There is a selector that fetches this data from the store like that: a user with its company and the address of the company.

```ts
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

Then the store can be updated by dispatching the `reduceGraph` action:

```ts
// Redux
store.dispatch(
  reduceGraph({
    data: response,
    selector: selectUser,
  }),
);
```

```ts
// NGRX
this.store.dispatch(
  reduceGraph({
    data: response,
    selector: selectUser,
  }),
);
// or
this.store.dispatch(
  new ReduceGraph(response, selectUser),
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
