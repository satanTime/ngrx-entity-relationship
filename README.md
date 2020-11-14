# A simple way to use relationships within ngrx/store, ngrx/entity and ngrx/data

[![npm version](https://badge.fury.io/js/ngrx-entity-relationship.svg)](https://badge.fury.io/js/ngrx-entity-relationship)
[![CircleCI](https://circleci.com/gh/satanTime/ngrx-entity-relationship.svg?style=shield)](https://app.circleci.com/pipelines/github/satanTime/ngrx-entity-relationship)
[![Coverage Status](https://coveralls.io/repos/github/satanTime/ngrx-entity-relationship/badge.svg?branch=master)](https://coveralls.io/github/satanTime/ngrx-entity-relationship?branch=master)

### Supports
- Angular 6 and `@ngrx/entity@6` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular6/src/app/entity))
- Angular 7 and `@ngrx/entity@7` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular7/src/app/entity))
- Angular 8 and `@ngrx/entity@8` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular8/src/app/entity))
- Angular 9 and `@ngrx/entity@9` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular9-ivy-true/src/app/entity))
- Angular 10 and `@ngrx/entity@10` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular10-ivy-true/src/app/entity))
- Angular 11 and `@ngrx/entity@10` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular11-ivy-true/src/app/entity))
* Angular 8 and `@ngrx/data@8` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular8/src/app/data))
* Angular 9 and `@ngrx/data@9` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular9-ivy-true/src/app/data))
* Angular 10 and `@ngrx/data@10` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular10-ivy-true/src/app/data))
* Angular 11 and `@ngrx/data@10` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular11-ivy-true/src/app/data))

### API short list

- [selector argument](#selector-argument)
* [rootEntity function](#rootentity-function)
* [relatedEntity function](#relatedentity-function)
* [childEntity function](#childentity-function)
* [childrenEntities function](#childrenentities-function)
- [rootEntitySelector function](#rootentityselector-function)
- [relatedEntitySelector function](#relatedentityselector-function)
- [childEntitySelector function](#childentityselector-function)
- [childrenEntitiesSelector function](#childrenentitiesselector-function)
- [rootEntities function](#rootentities-function)
* [relationships pipe operator](#relationships-pipe-operator)
* [rootEntityFlags options](#rootentityflags-options)
* [Types](#types)
* [Releasing cache](#releasing-cache)
* [Usage with createSelector](#usage-with-createselector)
* [Gathering information of a selector](#gathering-information-of-a-selector)
* [NGRX integration](#ngrx-store-integration)

## Problem

Imagine that we have the next models in `ngrx/store`:
```typescript
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

And now we want to get a user from `ngrx/store` with the related company and its address via single `select`
that the eventual entity would look like that:
```typescript
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

## Solution

Below you can find 2 solutions, support of [ngrx/entity](#relationships-in-ngrxentity)
and [ngrx/data](#relationships-in-ngrxdata).

More detailed information goes in the [API](#api) section.

> It's very easy to create a circular dependency, keep created selectors and their feature selectors / entity services
> in separate files.

### Relationships in ngrx/entity

Based on [ngrx docs](https://ngrx.io/guide/entity/adapter#entity-selectors)
we should have 3 feature selectors for every model.
```typescript
export const selectUserState = createFeatureSelector<fromUser.State>('users');
export const selectCompanyState = createFeatureSelector<fromCompany.State>('companies');
export const selectAddressState = createFeatureSelector<fromAddress.State>('addresses');
```

Then let's simply take them and define a store selector that returns an entity with relationships.
For that we need `rootEntity` and `relatedEntity` functions from the library.
```typescript
export const selectUser = rootEntity(
    selectUserState, // the selector of the user's feature.

    // now we define a relationship between a user and a company.
    relatedEntity(
        selectCompanyState, // a selector of the company's feature.
        'companyId', // the key in the user's model that points to the company's id.
        'company', // the key in the user's model that should be fulfilled with the company's entity.

        // now we define a relationship between a company and an address.
        relatedEntity(
            selectAddressState, // a selector of the address's feature.
            'addressId', // the key in the company's model that points to the address's id.
            'address', // the key in the company's model that should be fulfilled with the address's entity.
        ),
    ),
);
```

Besides a single user we can select a list of users.
For that we need `rootEntities` function from the library.
```typescript
export const selectUsers = rootEntities(
    selectUser, // simply pass here a select for a single entity.
);
```

Now we can use the defined selectors in controllers.
```typescript
const user$ = store.select(selectUser, 'userIdValue1');
const users$ = store.select(selectUsers, ['userIdValue1', 'userIdValue2']);
```

### Relationships in ngrx/data

Based on [ngrx docs](https://ngrx.io/guide/data/entity-collection-service#examples-from-the-demo-app)
we should have 3 entity collection services.
```typescript
const userService = EntityCollectionServiceFactory.create<User>('users');
const companyService = EntityCollectionServiceFactory.create<Company>('companies');
const addressService = EntityCollectionServiceFactory.create<Address>('addresses');
```

Or later based on [ngrx docs](https://ngrx.io/guide/data/entity-collection-service#create-the-entitycollectionservice-as-a-class)
we might have 3 service classes that extend `EntityCollectionServiceBase<T>`.
```typescript
const userService: UserEntityService;
const companyService: CompanyEntityService;
const addressService: AddressEntityService;
```

For the library both work.
Let's simply take them and define a store selector service that returns an entity with relationships.
For that we need `rootEntity` and `relatedEntity` functions from the library.

Besides a single user we can select a list of users.
For that we need `rootEntities` function from the library.
```typescript
@Injectable({providedIn: 'root'})
export class UserSelectorService {
    constructor(
        protected readonly store: Store,
        protected user: UserEntityService,
        protected company: CompanyEntityService,
        protected serviceFactory: EntityCollectionServiceFactory,
    ) {
    }

    public readonly selectUser = rootEntity(
        this.user, // a service of the User entity.

        // now we define a relationship between a user and a company.
        relatedEntity(
            this.company, // a service of the Company entity.
            'companyId', // the key in the user's model that points to the company's id.
            'company', // the key in the user's model that should be fulfilled with the company's entity.

            // now we define a relationship between a company and an address.
            relatedEntity(
                this.serviceFactory.create<Address>('addresses'), // a service of the Address entity.
                'addressId', // the key in the company's model that points to the address's id.
                'address', // the key in the company's model that should be fulfilled with the address's entity.
            ),
        ),
    );

    public readonly selectUsers = rootEntities(
        this.selectUser, // simply pass here a select for a single entity.
    );
}
```

Now we can use the defined selectors in controllers.
```typescript
const user$ = store.select(userSelectorService.selectUser, 'userIdValue1');
const users$ = store.select(userSelectorService.selectUsers, ['userIdValue1', 'userIdValue2']);
```

## API

### selector argument

a `selector` argument can be:
* a function that returns `EntityState<T>`
* an instance of `EntityCollectionService<T>`
* an instance of `EntityCollectionServiceBase<T>`
* an object `{collection, id}`

The last case is useful when `id` key of an entity isn't `id`, but an other: `Id`, `uuid`, etc.
Then you can define here a key name or a function that returns its value.
```typescript
const selector1 = {
    collection: createFeatureSelector('users'),
    id: 'Id',
};
const selector2 = {
    collection: createFeatureSelector('users'),
    id: 0,
};
const selector3 = {
    collection: createFeatureSelector('users'),
    id: entity => entity.uuid,
};
```

### rootEntity function

`rootEntity(selector, transformer?, ...relationships)` is an entry point function to create a selector for relationships.

`selector` is a selector that works with a root entity.

`transformer` is an optional function that can be useful when we need a
post processing transformation, for example to a class instance, actually an entity can be transformed to anything.
```typescript
const userClassInstance = rootEntity(
    selector,
    entity => plainToClass(UserClass, entity),
);
const userJsonString = rootEntity(
    selector,
    entity => JSON.stringify(entity),
);
```

`relationships` is an optional argument that is produced by a relationship function.

### relatedEntity function

`relatedEntity(selector, keyId, keyValue, ...relationships)` is a relationship function that defines a relationship based on data in its parent entity.

`selector` is a selector that works with a related entity.

`keyId` is a field in the parent entity that points to the related entity. (User.companyId -> Company.id)

`keyValue` an related entity will be set to this field in the parent entity.

> if `keyId` is an array of ids then `keyValue` has to be an array of related entities.

An example is the `User`, its model has `company`, `companyId`
and there is `selectCompanyState` that returns `EntityState<Company>`.
```typescript
const user = rootEntity(
    rootRelector,
    relatedEntity(selectCompanyState, 'companyId', 'company'),
);
```

`relationships` is an optional argument that is produced by a relationship function.

### childEntity function

`childEntity(selector, keyId, keyValue, ...relationships)` is a relationship function that defines a relationship based on data in its related entity.

`selector` is a selector that works with a related entity.

`keyId` is a field in the related entity that points to the parent entity. (Address.id -> Company.addressId)

`keyValue` an related entity will be set to this field in the parent entity.

`relationships` is an optional argument that is produced by a relationship function.
```typescript
const address = rootEntity(
    rootRelector,
    childEntity(selectCompanyState, 'addressId', 'company'),
);
```

### childrenEntities function

`childrenEntities(selector, keyId, keyValue, ...relationships)` is a relationship function that defines a relationship based on data in its related entity.

`selector` is a selector that works with a related entity.

`keyId` is a field in the related entity that points to the parent entity. (Company.id -> User.companyId)

`keyValue` an array of related entities will be set to this field in the parent entity.

`relationships` is an optional argument that is produced by a relationship function.
```typescript
const company = rootEntity(
    rootRelector,
    childrenEntities(selectUserState, 'companyId', 'staff'),
);
```

### rootEntitySelector function

`rootEntitySelector(selector, transformer?)` is a function to produce an entry point function.
The goal here is to simply the process of the selectors creation.

`selector` is a selector that works with a root entity.

`transformer` is the same as in `rootEntity`.

```typescript
const userSelector = rootEntitySelector(selector);

const user1 = userSelector();
// the same as.
const user2 = rootEntity(selector);
```

### relatedEntitySelector function

`relatedEntitySelector(selector, keyId, keyValue)` is a function to produce a relationship function.

`selector` is a selector that works with a related entity.

`keyId` is a field in the parent entity that points to the related entity. (User.companyId -> Company.id)

`keyValue` an related entity will be set to this field in the parent entity.
```typescript
const userSelector = rootEntitySelector(userSelector);
const userCompanySelector = relatedEntitySelector(companySelector, 'companyId', 'company');

const user1 = userSelector(
    userCompanySelector(),
);
// the same as.
const user2 = rootEntity(
    userSelector,
    relatedEntity(
        companySelector,
        'companyId',
        'company',
    ),
);
```

### childEntitySelector function

`childEntitySelector(selector, keyId, keyValue)` is a function to produce a relationship function.

`selector` is a selector that works with a related entity.

`keyId` is a field in the related entity that points to the parent entity. (Address.id -> Company.addressId)

`keyValue` an related entity will be set to this field in the parent entity.
```typescript
const addressSelector = rootEntitySelector(addressSelector);
const addressCompanySelector = childEntitySelector(companySelector, 'addressId', 'company');

const address1 = addressSelector(
    addressCompanySelector(),
);
// the same as.
const address2 = rootEntity(
    addressSelector,
    childEntity(
        companySelector,
        'addressId',
        'company',
    ),
);
```

### childrenEntitiesSelector function

`childrenEntitiesSelector(selector, keyId, keyValue)` is a function to produce a relationship function.

`selector` is a selector that works with a related entity.

`keyId` is a field in the related entity that points to the parent entity. (Company.id -> User.companyId)

`keyValue` an array of related entities will be set to this field in the parent entity.
```typescript
const companySelector = rootEntitySelector(companySelector);
const companyStaffSelector = childrenEntitiesSelector(userSelector, 'companyId', 'staff');

const company1 = companySelector(
    companyStaffSelector(),
);
// the same as.
const company2 = rootEntity(
    rootRelector,
    childrenEntities(
        selectUserState,
        'companyId',
        'staff',
    ),
);
```

### rootEntities function

`rootEntities(rootSelector)` is an entry point function to create a selector for a list of entities.

`rootSelector` is produced by `rootEntity` function.
```typescript
const selectUsers = rootEntities(selectUser);
```

### relationships pipe operator

The operator is useful when we already have a stream of existing entities
and would like to extend it with relationships.

For that we need:
* the `store` object
* a `selectUser` selector for relationships we want to apply
* observable stream of entities

Let's pretend we have a `user$` streams that emits a user time to time.
Then we can extend it with the next operation.
```typescript
const userWithRelationships$ = user$.pipe(
    // a user w/o relationships.
    relationships(store, selectUser),
    // now a user w/ relationships.
);
```

The same can be done for a stream that returns an array of users.
In this case a list selector should be used.
```typescript
const usersWithRelationships$ = users$.pipe(
    // users w/o relationships.
    relationships(store, selectUsers),
    // now users w/ relationships.
);
```

### rootEntityFlags options

There's a flag `rootEntityFlags.disabled` that can be useful for disabling selectors during updates of entities.
Simply set it to `true` before you start update and back to `false` after it.

**When you set it back to `false` you need to share the store to get updated entities**.

### Types

There is a list of recommended types.

#### HANDLER_ENTITY

Simplifies definition of `HANDLER_ROOT_ENTITY`:
```typescript
const selectUser1: HANDLER_ENTITY<User> = rootEntity(/*...*/);
// instead of
const selectUser2: HANDLER_ROOT_ENTITY<StoreState, User, User, string> = rootEntity(/*...*/);
```

#### HANDLER_ENTITIES

Simplifies definition of `HANDLER_ROOT_ENTITIES`:
```typescript
const selectUsers1: HANDLER_ENTITIES<User> = rootEntities(/*...*/);
// instead of
const selectUsers2: HANDLER_ROOT_ENTITIES<StoreState, User, User, string> = rootEntities(/*...*/);
```

### Releasing cache

Every function of the library that works with data selection returns a structure that has `release` function.
Its behavior and purpose is the same as
[Memoized Selectors](https://ngrx.io/guide/store/selectors#resetting-memoized-selectors) of `ngrx/store`.
Once you don't need a selector simply call `release` to reset the memoized value.
```typescript
const selectUser = rootEntity(selectUserState);
store.select(selectUser, 1).subsribe(user => {
    // ...some activity
    selectUser.release();
});
```

### Usage with createSelector

Imagine there are a selector that returns id of a current user and a selector with relationships:
```typescript
export const selectCurrentUserId = createSelector(
    selectUserFeature,
    feature => feature.currentUserId,
);

export const selectUserWithCompany = rootEntity(
    selectUserFeature,
    relatedEntity(
        selectCompanyFeature,
        'companyId',
        'company',
    ),
);
```

Then we have 3 options:

* combine them together via `createSelector` function
* pass an id selector as a parameter
* usage of `switchMap`

#### combine them together via `createSelector` function

```typescript
export const selectCurrentUser = createSelector(
    s => s, // selecting the whole store
    selectCurrentUserId, // selecting the id of a current user
    selectUserWithCompany, // selecting the user with desired relationships
);

store.select(selectCurrentUser).subscribe(user => {
    // profit
});
```

#### pass an id selector as a parameter of a relationship selector

```typescript
// selecting the user with desired relationships
store.select(selectUserWithCompany, selectCurrentUserId).subscribe(user => {
    // profit
});
```

#### usage of `switchMap`

```typescript
store.select(selectCurrentUserId).pipe( // selecting the id of a current user
    switchMap(id => store.select(selectUserWithCompany, id)),  // selecting the user with desired relationships
).subscribe(user => {
    // profit
});
```

### Gathering information of a selector

Besides the `release` function every selector provides information about itself.

* `ngrxEntityRelationship` - name of its function: `rootEntity`, `rootEntities`, `relatedEntity`, `childEntity` and `childrenEntities`.
* `collectionSelector` - a function that returns a collection of its entity.
* `idSelector` - a function that returns the id of the related entity.
* `relationships` - an array of passed relationships.

In case of relationship functions there are two more keys
* `keyId` - a name of the keyId field.
* `keyValue` - a name of the keyValue field.

## NGRX Store integration

All selectors can be used to update the store with response data.

For that `ngrxEntityRelationshipReducer` should be added as a meta reducer to the root import:
```typescript
StoreModule.forRoot({/* ... */}, {
    metaReducers: [
        // ...
        ngrxEntityRelationshipReducer, // <- add this
    ],
})
```

After that `reduceFlat` and `reduceGraph` can be used.

### ReduceFlat / reduceFlat action

This action helps to add to store data from a flat response.

Imagine a backend returns the next flat shape:
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

There's a selector that fetches this data from the store (it has to have meta info):
```typescript
export const selectUser = rootEntity(
    selectUserState,
    {
        flatKey: 'users',
    },
    relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
        {
            flatKey: 'companies',
        },
        relatedEntity(
            selectAddressState,
            'addressId',
            'address',
            {
                flatKey: 'addresses',
            },
        ),
    ),
);
```

Then the store can be updated by dispatching the `reduceFlat` action:
```typescript
this.store.dispatch(reduceFlat({
  data: response,
  selector: selectUser,
}));
// or
this.store.dispatch(new ReduceFlat(response, selectUser));
```

### ReduceGraph / reduceGraph action

This action helps to add to store data from a graph response.

Imagine a backend returns the next nested shape of a user:
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

There's a selector that fetches this data from the store:
```typescript
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
```typescript
this.store.dispatch(reduceGraph({
  data: response,
  selector: selectUser,
}));
// or
this.store.dispatch(new ReduceGraph(response, selectUser));
```

## Additional examples

Of course, we can select as many relationships as we want until we have a field with a related id.
Check how `childrenEntities` works. It gathers entities based on a parent field.

```typescript
export const selectUser = rootEntity(
    selectUserState,
    relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
        childrenEntities(
            selectUserState,
            'companyId',
            'staff',
        ),
        relatedEntity(
            selectUserState,
            'adminId',
            'admin',
        ),
        relatedEntity(
            selectAddressState,
            'addressId',
            'address',
            childEntity(
                selectCompanyState,
                'addressId',
                'company',
            ),
        ),
    ),
);
```

You can simplify the definition with predefined selectors.
Check how `childrenEntitiesSelector` works. It gathers entities based on a parent field.

```typescript
const entityUser = rootEntitySelector(selectUserState);
const entityUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
const entityCompanyStaff = childrenEntitiesSelector(selectUserState, 'companyId', 'staff');
const entityCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
const entityCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address');
const entityAddressCompany = childEntitySelector(selectCompanyState, 'addressId', 'company');

export const selectUserWithCompany = entityUser(entityUserCompany());
export const selectUserWithStrangePath = entityUser(
    entityUserCompany(
        entityCompanyStaff(),
        entityCompanyAdmin(),
        entityCompanyAddress(
            entityAddressCompany(
                entityCompanyAdmin(
                    entityUserCompany(
                        entityCompanyStaff(),
                    ),
                ),
            ),
        ),
    ),
);
```

## Transform an entity to a class instance

`rootEntity` and `rootEntitySelector` of the library support a `<T>(entity: T) => T` callback.
It should be specified as the latest argument, but before relationships definition.
The transformation happens after all relationships.

```typescript
const entityUser = rootEntitySelector(selectUserState, user => new UserClass(user));

export const selectUser = rootEntity(
    selectUserState,
    user => new UserClass(user),
    relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
        childrenEntities(
            selectUserState,
            'companyId',
            'staff',
        ),
        relatedEntity(
            selectUserState,
            'adminId',
            'admin',
        ),
        relatedEntity(
            selectAddressState,
            'addressId',
            'address',
            childEntity(
                selectCompanyState,
                'addressId',
                'company',
            ),
        ),
    ),
);
```

## Warnings

-   An entity from the same feature with the same id is a different object after a rootEntity selector.

    It allows avoiding of circular references.

-   A selector emits an updated entity only in case if the root or a nested entity has been updated in the store.

-   A value of any related key can be `undefined`.

## Troubleshooting

### Circular dependency

`WARNING in Circular dependency detected` - simply put created selectors in a separate file.

A file where we have feature selectors (anything, but not selectors with relationships): `store.ts`
```typescript
export const selectUserState = createFeatureSelector<fromUser.State>('users');
export const selectCompanyState = createFeatureSelector<fromCompany.State>('companies');
export const selectAddressState = createFeatureSelector<fromAddress.State>('addresses');
```

A separate file where we import all feature selectors and declare combined selectors with relationships: `selectors.ts`
```typescript
import {selectUserState, selectCompanyState, selectAddressState} from 'store.ts';

export const selectUser = rootEntity(
    selectUserState, // the selector of the user's feature.

    // now we define a relationship between a user and a company.
    relatedEntity(
        selectCompanyState, // a selector of the company's feature.
        'companyId', // the key in the user's model that points to the company's id.
        'company', // the key in the user's model that should be fulfilled with the company's entity.

        // now we define a relationship between a company and an address.
        relatedEntity(
            selectAddressState, // a selector of the address's feature.
            'addressId', // the key in the company's model that points to the address's id.
            'address', // the key in the company's model that should be fulfilled with the address's entity.
        ),
    ),
);
```

This approach helps to solve circular dependencies.

### expected member-variable-declaration to have a typedef (typedef)

The answer is in [Types](#types).

There are two common types: `HANDLER_ROOT_ENTITY` and `HANDLER_ROOT_ENTITIES`,
but they are complicated and to solve the issue they can be replaced by `HANDLER_ENTITY`, `HANDLER_ENTITIES`.

```typescript
const selectUser: HANDLER_ENTITY<User> = rootEntity(/*...*/);
const selectUsers: HANDLER_ENTITIES<User> = rootEntities(/*...*/);
```
