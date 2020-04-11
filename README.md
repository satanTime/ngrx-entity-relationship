# A simple way to use relationships within ngrx/store, ngrx/entity and ngrx/data

[![CircleCI](https://circleci.com/gh/satanTime/ngrx-entity-relationship.svg?style=shield)](https://app.circleci.com/pipelines/github/satanTime/ngrx-entity-relationship)
[![npm version](https://badge.fury.io/js/ngrx-entity-relationship.svg)](https://badge.fury.io/js/ngrx-entity-relationship)

### Supports
* Angular 8 and `@ngrx/data@8` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular8/src/app/data))
* Angular 9 and `@ngrx/data@9` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular9/src/app/data))
- Angular 6 and `@ngrx/entity@6` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular6/src/app/entity))
- Angular 7 and `@ngrx/entity@7` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular7/src/app/entity))
- Angular 8 and `@ngrx/entity@8` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular8/src/app/entity))
- Angular 9 and `@ngrx/entity@9` ([real usage example](https://github.com/satanTime/ngrx-entity-relationship/tree/master/e2e/angular9/src/app/entity))

### API

* [rootEntity function](#rootentity-function)
* [relatedEntity function](#relatedentity-function)
* [childEntity function](#childentity-function)
* [childrenEntities function](#childrenentities-function)
- [rootEntitySelector function](#rootentityselector-function)
- [relatedEntitySelector function](#relatedentityselector-function)
- [childEntitySelector function](#childentityselector-function)
- [childrenEntitiesSelector function](#childrenentitiesselector-function)
* [selector argument](#selector-argument)
* [rootEntities function](#rootentities-function)
* [relationships pipe operator](#relationships-pipe-operator)
* [rootEntityFlags options](#rootentityflags-options)

## Problem

Imagine that we have the next models in `ngrx/store`:
```typescript
export interface User {
    id: string;
    firstName: string;
    firstLast: string;

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

Below you can find 2 solutions, for support for [ngrx/entity](#relationships-in-ngrx-entity)
and [ngrx/data](#relationships-in-ngrx-data).

More detailed information goes in the [API](#api) section.

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

Now are can use the defined selectors in controllers.
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

Now are can use the defined selectors in controllers.
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

`transformer` is an optional function that can be useful when we need a
post processing transformation, for example to a call instance.
```typescript
rootEntity(
    selector,
    entity => plainToClass(UserClass, entity),
);
```

`relationships` is an optional argument that is produced by a relationship function.

### relatedEntity function

`relatedEntity(selector, keyId, keyValue, ...relationships)` is a relationship function that defines a relationship based on data in its parent entity.

`selector` is a selector that works with the related entity.

`keyId` is a field in the parent entity that points to the related entity. (User.companyId -> Company.id)

`keyValue` an related entity will be set to this field in the parent entity.

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

`selector` is a selector that works with the related entity.

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

TBD

### rootEntitySelector function

TBD

### relatedEntitySelector function

TBD

### childEntitySelector function

TBD

### childrenEntitiesSelector function

TBD

### rootEntities function

TBD

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

## Additional examples

Of course we can select as many relationships as we want until we have a field with a related id.
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
