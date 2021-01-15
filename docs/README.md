---
description: ngrx-entity-relationship provides ease of selecting related entities in Redux and NGRX, supports normalization and helps to build GraphQL queries. 
---

`ngrx-entity-relationship` is a library for **Redux** and **NGRX**
which aims to facilitate work with [related entities in a normalized store](guide/quick.md) with a simple ORM solution.
It also provides a middleware that can normalize
[linear](normalization/linear.md)
or [graph](normalization/graph.md)
data and gracefully update the store.

Apart from that, it has helper functions to build **GraphQL** queries,
so, eventually, only selectors should be managed, the rest is done automatically.  

The current version of `ngrx-entity-relationship` has been tested and can be used with:

- Redux 4, React Redux 7, **try it live on [CodeSandbox](https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-react?file=/src/MyComponent.tsx)**

- NGRX 10, **try it live on [StackBlitz](https://stackblitz.com/github/satanTime/ngrx-entity-relationship-angular?file=src/app/app.component.ts)
  or [CodeSandbox](https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-angular?file=/src/app/app.component.ts)**
- NGRX 9
- NGRX 8
- NGRX 7
- NGRX 6

## Problem of normalized entities and their relationships in Redux and NGRX

Let's imagine that we have the next models:

```ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;

  company?: Company;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;

  staff?: Array<User>;

  admin?: User;
  adminId?: string;

  address?: Address;
  addressId?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  country: string;

  company?: Company;
}
```

Entities of every model are normalized and stored in the store independently:

```ts
const rootState = {
  users: {
    ids: ['1', '2'],
    entities: {
      '1': {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        companyId: '1',
      },
      '2': {
        id: '2',
        firstName: 'Jack',
        lastName: 'Black',
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

Now, we want to **select from the store an entity** of user with the related company and its address.
The desired shape should be like that:

```ts
const user = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  companyId: '1',
  company: {
    id: '1',
    name: 'Magic',
    adminId: '2',
    addressId: '1',
    address: {
      id: '1',
      street: 'Main st.',
      city: 'Town',
      country: 'Land',
    },
  },
};
```

## Solution for selecting related entities in Redux and NGRX

Can you believe that the eventual solution is like that?

```ts
const selectUser = rootUser(
  relUserCompany(
    relCompanyAddress(),
  ),
);
```

And, it is able to return any **relational data**, until there is a configured **relationship between entities**.

```ts
const selectUser = rootUser(
  relUserCompany(
    relCompanyStaff(
      relUserCompany(
          relCompanyAdmin(),
      ),
    ),
    relCompanyAddress(
      relAddressCompany(
        relCompanyAdmin(
          relUserCompany(
            relCompanyAddress(),
          ),
        ),
      ),
    ),
  ),
);
```

## Selecting in Redux

If we use `mapStateToProps` and **Redux** in **React**, then we could select entities like that:

```ts
const mapStateToProps = state => {
  return {
    user: selectUser(state, selectUserId),
  };
};
```

## Selecting in NGRX

if we use **NGRX** in **Angular**, then we could select entities like that:

```ts
class MyComponent {
  ngOnInit() {
    this.user$ = this.store.select(
      selectUser,
      selectUserId,
    );
  }
}
```
