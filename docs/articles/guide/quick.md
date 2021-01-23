---
title: Quick guide into ORM selectors for Redux and NGRX
description: A quick guide about how to configure and use selectors with relational data in Redux or NGRX
sidebar_label: Quick guide
---

First of all, to avoid circular dependencies,
when a user needs a company which needs staff which is an array of users etc,
we need to follow the next rules:

- **The rule #1**: always keep definition of **relationships in a separate file**
- **The rule #2**: ALWAYS KEEP DEFINITION OF **RELATIONSHIPS IN A SEPARATE FILE**
- **The rule #3**: never define anything, even standard selectors, additionally in these files

> If you need a solution for `@ngrx/data`,
> then please read [the related section](ngrx-data.md) after this manual.

## Installation

```bash npm2yarn
npm install ngrx-entity-relationship --save
```

## Normalized state structure for Redux and NGRX

The first step is to ensure that entities are reduced into **the proper state**, there are two properties usually:

- the first one stores an array of ids
- the second one stores a map of entities, where keys are ids and values are normalized shapes

```ts
export interface UserState {
  ids: Array<string>;
  entities: Dictionary<User>;
}

export interface CompanyState {
  ids: Array<string>;
  entities: Dictionary<Company>;
}

// different keys are an example
export interface AddressState {
  existingIds: Array<string>;
  byIds: Dictionary<Address>;
}
```

Of course, keys can have any names, like `AddressState` has `existingIds` and `byIds`.
Also, it is fine, if the state does not have the array of ids,
the only requirement is the `Dictionary` (a regular object).

## Selectors for entity states

The next step is to define functions which select the state of an entity.
In this library, they are called [**entity state selectors**](../api/core/entity-state-selector.md).

```ts
// Redux
export const selectUserState = state => state.users;
export const selectCompanyState = state => state.companies;
// `stateKeys` function helps in case of different names of the properties.
export const selectAddressState = stateKeys(
  state => state.addresses,
  'byIds',
  'existingIds',
);
```

```ts
// NGRX
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

These functions can be defined in the same file where the corresponding or root reducer is defined.

## Definition for root and relationship selectors

Now, we need to define root factories and their relationships.
The best way is to follow the rule #1 and to create a separate file for that.
We can either put all of them together or create a file per entity.
The main goal is to define **only factories and their relationships** in them, nothing else, no helpers.
If you need a helper, then it should be defined anywhere else and importer here.

This part is the same for both **Redux** and **NGRX**.

First, we need to create a [**root selector factory**](../api/core/rootentityselector-function.md) for the desired entity.
Then, we create a [**relationship selector factory**](../api/core/relatedentityselector-function.md) to fetch its relationships.

```ts
// user
export const rootUser = rootEntitySelector(selectUserState);
// user.company
export const relUserCompany = relatedEntitySelector(
  selectCompanyState,
  'companyId',
  'company',
);

// company
export const rootCompany = rootEntitySelector(selectCompanyState);
// company.staff
export const relCompanyStaff = childrenEntitiesSelector(
  selectUserState,
  'companyId',
  'staff',
);
// company.admin
export const relCompanyAdmin = relatedEntitySelector(
  selectUserState,
  'adminId',
  'admin',
);
// company.address
export const relCompanyAddress = relatedEntitySelector(
  selectAddressState,
  'addressId',
  'address',
);

// address
export const rootAddress = rootEntitySelector(selectAddressState);
// address.company
export const relAddressCompany = childEntitySelector(
  selectCompanyState,
  'addressId',
  'company',
);
```

As you see, **root selector factories** are created by [`rootEntitySelector`](../api/core/rootentityselector-function.md).
It accepts an [**entity state selector**](../api/core/entity-state-selector.md) which belongs to the root entity
(`selectUserState` for users, `selectCompanyState` for companies, etc).

A **relationship selector factory** is created by [`relatedEntitySelector`](../api/core/relatedentityselector-function.md).
It accepts an [**entity state selector**](../api/core/entity-state-selector.md) which belongs to the related entity
(`selectCompanyState` when we want to fulfill `user.company`),
the property name which points to id of the related entity (`companyId`) in the **root entity**,
and the property name where the related entity will be set (`company`) in the **root entity**.

There is a special case, `Address` doesn't have `companyId`,
but we want to be able to select an `address.company`.
There is [`childEntitySelector`](../api/core/childentityselector-function.md) for such cases.
It accepts an [**entity state selector**](../api/core/entity-state-selector.md) which belongs to the related entity (`selectCompanyState`),
the property name in the **related entity** which points to **the root entity** (`addressId`),
and the property name where the related entity will be set (`company`) in **the root entity**.

In case of arrays, such as `company.staff`, there is [`childrenEntitiesSelector`](../api/core/childrenentitiesselector-function.md) in the lib.

[`relatedEntitySelector`](../api/core/relatedentityselector-function.md) handles both single entities and arrays of them.

## Creating Redux and NGRX selectors of entities with relationships

Now, let's go to a component where we want to select a user with relationships,
and create a **root selector** via the factories there:

```ts
// Redux
const selectUser = rootUser(
  relUserCompany(
    relCompanyAddress(),
  ),
);

const mapStateToProps = state => {
  return {
    user: selectUser(state, '1'), // '1' is the id of user
  };
};

export default connect(mapStateToProps)(MyComponent);
```

```ts
// NGRX
export class MyComponent {
  public readonly users$: Observable<User>;

  private readonly selectUser =
    rootUser(
      relUserCompany(
        relCompanyAddress(),
      ),
    );

  constructor(private store: Store) {
    this.users$ = this.store.select(
      this.selectUser,
      '1', // '1' is the id of user
    );
  }
}
```

Of course, instead of a hardcoded id like `1`, we can pass another **selector, that selects ids** from the state.

```ts
// Redux
selectUser(state, selectCurrentUserId);
```

```ts
// NGRX
this.store.select(this.selectUser, selectCurrentUserId);
```

Where `selectCurrentUserId` might be like that:

```ts
const selectCurrentUserId = globalState =>
  globalState.auth.currentUserId;
```

## Selecting an array of entities

A user is fine, but what about an array of users?
The answer is [`rootEntities`](../api/core/rootentities-function.md).
Simply pass an existing **root selector** into it.

```ts
const selectUsers = rootEntities(selectUser);
```

Now we can use `selectUsers` in our components, but instead of an id, it requires an array of them.

```ts
// Redux
selectUsers(state, ['1', '2']);
```

```ts
// NGRX
this.store.select(this.selectUsers, ['1', '2']);
```

Or a selector that selects an array of ids from the state.

Profit.
