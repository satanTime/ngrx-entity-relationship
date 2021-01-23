---
title: Building GraphQL queries
description: A guide how a selector can be turned into a GraphQL query
sidebar_label: Building GraphQL queries
---

`ngrx-entity-relationship` has a set of helper functions to **convert existing selectors** into **GraphQL** queries.

Imagine we have a selector that selects a user, its company and the address of the company:

```ts
export const selectUser = rootUser(
  relUserCompany(
    relCompanyAddress()
  ),
);
```

And we want to build a **GraphQL** query that fetches a user, its company and the address of the company:

```graphql
{
  user(id: "1") {
    id
    firstName
    lastName
    companyId
    company {
      id
      name
      addressId
      address {
        id
        street
        city
        country
      }
    }
  }
}
```

ORM selectors by `ngrx-entity-relationship` have information about relationships,
but do not know about normal fields such as `firstName`, `lastName` etc.

To solve this, `ngrx-entity-relationship` provides a meta key called `gqlFields`,
which is an array of strings (entity keys).

Therefore, to solve the issue we need to fill the `gqlFields` in every selector.

To do that, we need to go the place where the factory functions are defined
and add meta information about **GraphQL**.

> Don't forget to include fields for ids.

```ts
// user
export const rootUser = rootEntitySelector(selectUserState, {
  // here we go
  gqlFields: ['id', 'firstName', 'lastName'],
});
// user.company
export const relUserCompany = relatedEntitySelector(
  selectCompanyState,
  'companyId',
  'company',
  {
    // here we go
    gqlFields: ['id', 'name'],
  },
);
// company.address
export const relCompanyAddress = relatedEntitySelector(
  selectAddressState,
  'addressId',
  'address',
  {
    // here we go
    gqlFields: ['id', 'street', 'city', 'country'],
  },
);
```

Profit, now we can use this selector to generate a **GraphQL** query via `toGraphQL` helper functions.

```ts
// works for arrays of entities
const allUsers = toGraphQL(
  'users',
  selectUser,
);

// works with parameters
const userId1 = toGraphQL(
  'user(id: "1")',
  selectUser,
);

// converts objects as parameters
const userId2 = toGraphQL(
  'user',
  {id: '2'},
  selectUser,
);
```

The result will be

```graphql
{
  users {
    id
    firstName
    lastName
    companyId
    company {
      id
      name
      addressId
      address {
        id
        street
        city
        country
      }
    }
  }
}
```

```graphql
{
  user(id: "1") {
    id
    # and all other fields with relationships.
  }
}
```

```graphql
{
  user(id: "2") {
    id
    # and all other fields with relationships.
  }
}
```

If we want, we can combine these three queries into a single query.
In order to do that we need to use `toGraphQL` again, but with aliases:

```ts
const combined = toGraphQL(
  toGraphQL('all:users', selectUser),
  toGraphQL('u1:user(id: "1")', selectUser),
  toGraphQL('u2:user', {id: '2'}, selectUser),
);
```

It will generate:

```graphql
{
  all: users {
    id
    # ...
  }
  u1: user(id: "1") {
    id
    # ...
  }
  u2: user(id: "2") {
    id
    # ...
  }
}
```
