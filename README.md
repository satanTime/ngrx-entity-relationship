[![chat on gitter](https://img.shields.io/gitter/room/satanTime/ngrx-entity-relationship)](https://gitter.im/ngrx-entity-relationship/community)
[![npm version](https://img.shields.io/npm/v/ngrx-entity-relationship)](https://www.npmjs.com/package/ng-mocks)
[![build status](https://circleci.com/gh/satanTime/ngrx-entity-relationship.svg?style=shield)](https://app.circleci.com/pipelines/github/satanTime/ngrx-entity-relationship)
[![coverage status](https://img.shields.io/coveralls/github/satanTime/ngrx-entity-relationship/master)](https://coveralls.io/github/satanTime/ngrx-entity-relationship?branch=master)
[![language grade](https://img.shields.io/lgtm/grade/javascript/g/satanTime/ngrx-entity-relationship)](https://lgtm.com/projects/g/satanTime/ngrx-entity-relationship/context:javascript)

# Ease of selecting related entities in Redux and NGRX

`ngrx-entity-relationship` is a library for **Redux** and **NGRX**
which aims to facilitate work with related entities in a normalized store with a simple ORM solution.
It also provides a middleware that can normalize
[linear](#reduceflat--reduceflat-action)
or [graph](#reducegraph--reducegraph-action)
data and gracefully update the store.

The current version of the library has been tested and can be used with:

- React Redux 7, **try it live on [CodeSandbox](https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-react?file=/src/MyComponent.tsx)**
* Redux 4
- NGRX 10, **try it live on [StackBlitz](https://stackblitz.com/github/satanTime/ngrx-entity-relationship-angular?file=src/app/app.component.ts)**
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
            }
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
            }
        }
    }
}
```

Now we want to select an entity of user from the store with the related company and its address.
The desired shape is like that:
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

Can you believe that the eventual solution is like that?

```ts
const desiredUserShape = rootUser(
    relUserCompany(
        relCompanyAddress(),
    ),
);
```

And it's able to return any **relational data** until there is a configured selector between entities.

```ts
const desiredUserShape = rootUser(
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

If we use `mapStateToProps` and **Redux** in **React**, then we could use the selector like that:
```ts
const mapStateToProps = (state) => {
    return {
        user: desiredUserShape(state, selectUserId),
    };
};
```

if we use **NGRX** in **Angular**, then we could use the selector like that:
```ts
class MyComponent {
    ngOnInit() {
        this.user$ = this.store.select(
            desiredUserShape,
            selectUserId,
        );
    }
}
```

Let's go into details.

## How to write selectors with relational data in Redux or NGRX

First of all, to avoid circular dependencies,
when a user needs a company which needs staff which is an array of users etc,
we need to follow the next rules:

- **The rule #1**: always keep definition of **relationships in a separate file**
- **The rule #2**: ALWAYS KEEP DEFINITION OF **RELATIONSHIPS IN A SEPARATE FILE**
- **The rule #3**: never define anything, even standard selectors, additionally in these files

> If you need a solution for `@ngrx/data`,
> then please read [the related section](#relationships-between-entities-in-ngrxdata) after this manual.

### Normalized state structure for Redux and NGRX

The first step is to ensure that entities are reduced into the proper state, usually there are two properties:
the first one stores an array of ids, and the second one stores a map of entities where keys are ids and values are normalized shapes.  

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
Also, it is fine if the state does not have the array of ids,
the only requirement is the `Dictionary` (a regular object).

### Selectors for entity states

The next step is to define functions which select the state of an entity.
In this documentation, they are called **entity state selectors**.

```ts
// Redux
export const selectUserState = (state) => state.users;
export const selectCompanyState = (state) => state.companies;
// `stateKeys` function helps in case of different names of the properties.  
export const selectAddressState = stateKeys((state) => state.addresses, 'byIds', 'existingIds');
```

```ts
// NGRX
export const selectUserState = createFeatureSelector<fromUser.State>('users');
export const selectCompanyState = createFeatureSelector<fromCompany.State>('companies');
export const selectAddressState = createFeatureSelector<fromAddress.State>('addresses');
```

These functions can be defined in the same file where the corresponding or root reducer is defined. 

### Definition for root and relationship selectors

Now we need to define roots and their relationships.
The best way is to follow the rule #1 and to create a separate file for that.
We can either put all of them together or create a file per entity,
the main goal is to define only factories in them, nothing else, no helpers.
If you need a helper, then it should be defined anywhere else and importer here.

This part is the same for both **Redux** and **NGRX**.

First, we need to create a **root selector factory** for the desired entity.
Then, we create a **relationship selector factory** to fetch its relationships.

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

As you see, **root selector factories** are created by [`rootEntitySelector`](#rootentityselector-function).
It accepts an **entity state selector** which belongs to the root entity
(`selectUserState` for users, `selectCompanyState` for companies, etc).

A **relationship selector factory** is created by [`relatedEntitySelector`](#relatedentityselector-function).
It accepts an **entity state selector** which belongs to the related entity
(`selectCompanyState` when we want to fulfill `user.company`),
the property name which points to id of the related entity (`companyId`) in the **root entity**,
and the property name where the related entity will be set (`company`) in the **root entity**.

There is a special case, `Address` doesn't have `companyId`,
but we want to be able to select an `address.company`.
There is [`childEntitySelector`](#childentityselector-function) for such cases.
It accepts an **entity state selector** which belongs to the related entity (`selectCompanyState`),
the property name in the **related entity** which points to **the root entity** (`addressId`),
and the property name where the related entity will be set (`company`) in **the root entity**.

In case of arrays, such as `company.staff`, there is [`childrenEntitiesSelector`](#childrenentitiesselector-function) in the lib.

[`relatedEntitySelector`](#relatedentityselector-function) handles both single entities and arrays of them.

### Creating Redux and NGRX selectors of entities with relationships

Now, let's go to a component where we want to select a user with relationships,
create a **root selector** via its factories there, and use it:

```ts
// Redux
const desiredUserShape = rootUser(
    relUserCompany(
        relCompanyAddress(),
    ),
);

const mapStateToProps = (state) => {
    return {
        user: desiredUserShape(state, '1'), // '1' is the id of user
    };
};

export default connect(mapStateToProps)(MyComponent);
```

```ts
// NGRX
export class MyComponent {
    public readonly users$: Observable<User>;

    private readonly desiredUserShape = rootUser(
        relUserCompany(
            relCompanyAddress(),
        ),
    );

    constructor(private store: Store) {
        this.users$ = this.store.select(
            this.desiredUserShape,
            '1', // '1' is the id of user
        );
    }
}
```

Of course, instead of a hardcoded id like `1`, you can pass another selector, that selects ids from the state.

```ts
// Redux
desiredUserShape(state, selectCurrentUserId);
```

```ts
// NGRX
this.store.select(
    this.desiredUserShape,
    selectCurrentUserId,
);
```

Where `selectCurrentUserId` might be like that:

```ts
const selectCurrentUserId = (globalState) => globalState.auth.currentUserId;
```

### Selecting an array of entities

A user is fine, but what about an array of users?
The answer is [`rootEntities`](#rootentities-function). Simply pass an existing **root selector** into it.

```ts
const desiredUsers = rootEntities(desiredUserShape);
```

Now we can use `desiredUsers` in our components, but instead of an id, it requires an array of them.

```ts
// Redux
desiredUsers(state, ['1', '2']);
```

```ts
// NGRX
this.store.select(
    this.desiredUsers,
    ['1', '2'],
);
```

Or a selector that selects an array of ids from the state.

Profit.
[Watch update on github](https://github.com/satanTime/ngrx-entity-relationship),
[give a star](https://github.com/satanTime/ngrx-entity-relationship),
[share on twitter](https://twitter.com/intent/tweet?text=Check+ngrx-entity-relationship+package&url=https%3A%2F%2Fgithub.com%2FsatanTime%2Fngrx-entity-relationship).

**TL;DR**

There are many more features, such as:

- normalization of backend responses with respective state update: [flat](#reduceflat--reduceflat-action) and [graph](#reducegraph--reducegraph-action)
- [memoized / cached selectors](#releasing-cache)
- [simplified types for typescript](#types)
- [selectors metadata for whatever needs](#gathering-information-about-selectors)

## Table of contents 

- [Relationships between entities in `@ngrx/data`](#relationships-between-entities-in-ngrxdata)

* [Normalizing flat structures](#reduceflat--reduceflat-action)
* [Normalizing graph structures](#reducegraph--reducegraph-action)
  
- [API](#api)
    - [possible selector definition](#entity-state-selector)
    * [rootEntity](#rootentity-function)
    * [relatedEntity](#relatedentity-function)
    * [childEntity](#childentity-function)
    * [childrenEntities](#childrenentities-function)
    - [rootEntitySelector](#rootentityselector-function)
    - [relatedEntitySelector](#relatedentityselector-function)
    - [childEntitySelector](#childentityselector-function)
    - [childrenEntitiesSelector](#childrenentitiesselector-function)
    - [rootEntities](#rootentities-function)
    * [relationships pipe operator](#relationships-pipe-operator)
    * [rootEntityFlags options](#rootentityflags-options)
    * [Types](#types)

* [Releasing cache](#releasing-cache)
* [Usage with createSelector from NGRX](#usage-with-createselector-from-ngrx)
* [Gathering information of selectors](#gathering-information-about-selectors)

-----

### Relationships between entities in `@ngrx/data`

Based on [ngrx docs](https://ngrx.io/guide/data/entity-collection-service#examples-from-the-demo-app)
we should have 3 entity collection services.
```ts
const userService = EntityCollectionServiceFactory.create<User>('users');
const companyService = EntityCollectionServiceFactory.create<Company>('companies');
const addressService = EntityCollectionServiceFactory.create<Address>('addresses');
```

Or later based on [ngrx docs](https://ngrx.io/guide/data/entity-collection-service#create-the-entitycollectionservice-as-a-class)
we might have 3 service classes which extend `EntityCollectionServiceBase<T>`.
```ts
const userService: UserEntityService;
const companyService: CompanyEntityService;
const addressService: AddressEntityService;
```

For the library both will work.
Let's simply take them and define a service that contains **root selectors** which returns an entity with relationships.
For that we need [`rootEntity`](#rootentity-function) and [`relatedEntity`](#rootentities-function) functions from the library.

```ts
@Injectable({providedIn: 'root'})
export class UserSelectorService {
    // important dependencies
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

Except a single user, we can select an array of users.
For that we need [`rootEntities`](#rootentities-function) function from the library.
```ts
export class UserSelectorService {
    // ...
    public readonly selectUsers = rootEntities(
        this.selectUser, // simply pass here a select for a single entity.
    );
    // ...
}
```

Now we can use the defined selectors in components.
```ts
export class MyComponent {
    constructor(store: Store, userSelectors: UserSelectorService) {
        this.user$ = store.select(userSelectors.selectUser, '1');
        this.users$ = store.select(userSelectors.selectUsers, ['1', '2']);
    }
}
```

## API

### Entity state selector

An **entity state selector** can be:
- a function that returns `EntityState<T>`
- an instance of `EntityCollectionService<T>`
- an instance of `EntityCollectionServiceBase<T>`
- an object `{collection: selector, id: selector}`

The last case is useful when the `id` key of an entity isn't `id`, but another one: `Id`, `uuid`, etc.
Then you can define here the key name, or a function which returns its value from an entity.
```ts
const selector1 = {
    collection: createFeatureSelector('users'),
    id: 'Id',
};
const selector2 = {
    collection: state => state.companies,
    id: 'uuid',
};
const selector3 = {
    collection: stateKeys(createFeatureSelector('addresses'), 'byIds', 'existingIds'),
    id: entity => entity.uuid,
};
```

### rootEntity function

`rootEntity` is a **root selector factory**,
its call produces a **root selector** which can be used with **Redux** and **NGRX**.

```ts
declare function rootEntity(
    entityStateSelector,
    transformer?,
    ...relationships
);
```

- `entityStateSelector` - is an **entity state selector** of a desired entity.

- `transformer` - is an optional function which can be useful if we need a post processing transformation,
   for example, to a class instance, basically an entity can be transformed to anything.
   ```ts
   const userClassInstance = rootEntity(
       selector,
       entity => plainToClass(UserClass, entity),
   );
   // selected entity will be an instance of UserClass.
   
   const userJsonString = rootEntity(
       selector,
       entity => JSON.stringify(entity),
   );
   // selected entity will be a JSON string.
   ```

- `relationships` - is an optional parameter which accepts **relationship selectors** for the root entity.

### relatedEntity function

`relatedEntity` is a **relationship selector factory**,
its call produces a **relationship selector** which can be used within **root selectors** and another suitable **relationship selectors**.

It is useful when the id of the related entity is stored in the parent entity.

```ts
declare function relatedEntity(
    entityStateSelector,
    keyId,
    keyValue,
    ...relationships
)
```

- `entityStateSelector` - is an **entity state selector** of a desired entity.
- `keyId` - a property name in the parent entity which points to the id of the related entity. (User.companyId -> Company.id)
- `keyValue` - a property name in the parent entity where the related entity should be assigned.

   > if `keyId` is an array of ids, then `keyValue` has to be an array of the related entities too.

- `relationships` - is an optional parameter which accepts **relationship selectors** for the related entity.

An example is the `User`. Its model has `companyId`, `company`,
and there is `selectCompanyState` that returns `EntityState<Company>`.
Therefore, if we want a selector which fetches a user with its company it might look like:

```ts
const user = rootEntity(
    selectUserState,
    relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
    ),
);
```

### childEntity function

`childEntity` is a **relationship selector factory**,
its call produces a **relationship selector** which can be used within **root selectors** and another suitable **relationship selectors**. 

It is useful when the parent entity does not have the id of the related entity, but the related entity has the id of the parent entity.

```ts
declare function childEntity(
    entityStateSelector,
    keyId,
    keyValue,
    ...relationships
)
```

- `entityStateSelector` - is an **entity state selector** of a desired entity.
- `keyId` - a property name in the related entity which points to the id of the parent entity. (Address.id -> Company.addressId)
- `keyValue` - a property name in the parent entity where the related entity should be assigned.
- `relationships` - is an optional parameter which accepts **relationship selectors** for the related entity.

An example is the `Address`. Its model has `company`, but does not have `companyId`.
However, `Company` entity has `addressId`.
Therefore, if we want a selector which fetches an address with its company it might look like:

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

### childrenEntities function

`childrenEntities` is a **relationship selector factory**,
its call produces a **relationship selector** which can be used within **root selectors** and another suitable **relationship selectors**.

It is useful when the parent entity has a relationship to an array of entities and does not have ids of them, but the related entity has the id of the parent entity.

```ts
declare function childrenEntities(
    entityStateSelector,
    keyId,
    keyValue,
    ...relationships
)
```

- `entityStateSelector` - is an **entity state selector** of a desired entity.
- `keyId` - a property name in the related entity which points to the id of the parent entity. (Company.id -> User.companyId)
- `keyValue` - a property name in the parent entity where the array of related entities should be assigned.
- `relationships` - is an optional parameter which accepts **relationship selectors** for the related entities.

An example is the `Company`. Its model has `staff`, but does not have `staffId`.
However, `User` entity has `companyId`.
Therefore, if we want a selector which fetches a company with its staff it might look like:

```ts
const company = rootEntity(
    selectCompanyState,
    childrenEntities(
        selectUserState,
        'companyId',
        'staff',
    ),
);
```

### rootEntitySelector function

`rootEntitySelector` is a function which creates a predefined **root selector factory**.
The goal here is to simply the process of creating **root selectors** with [`rootEntity`](#rootentity-function).

```ts
declare function rootEntitySelector(
    entityStateSelector,
    transformer?
)
```

It's parameters are the same as [`rootEntity`](#rootentity-function) has, but without relationships.

```ts
const user = rootEntitySelector(selectUserState);

// later.
const user1 = user();

// the same as.
const user2 = rootEntity(selectUserState);
```

### relatedEntitySelector function

`relatedEntitySelector` is a function which creates a predefined **relationship selector factory**.
The goal here is to simply the process of creating **relationship selectors** with [`relatedEntity`](#relatedentity-function).

```ts
declare function relatedEntitySelector(
    entityStateSelector,
    keyId,
    keyValue
)
```

It's parameters are the same as [`relatedEntity`](#relatedentity-function) has, but without relationships.

```ts
const user = rootEntitySelector(selectUserState);
const userCompany = relatedEntitySelector(
    selectCompanyState,
    'companyId',
    'company',
);

// later.
const user1 = user(
    userCompany(),
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

`childEntitySelector` is a function which creates a predefined **relationship selector factory**.
The goal here is to simply the process of creating **relationship selectors** with [`childEntity`](#childentity-function).

```ts
declare function childEntitySelector(
    entityStateSelector,
    keyId,
    keyValue
)
```

It's parameters are the same as [`childEntity`](#childentity-function) has, but without relationships.

```ts
const address = rootEntitySelector(selectAddressState);
const addressCompany = childEntitySelector(
    selectCompanyState,
    'addressId',
    'company',
);

// later.
const address1 = address(
    addressCompany(),
);

// the same as.
const address2 = rootEntity(
    selectAddressState,
    childEntity(
        selectCompanyState,
        'addressId',
        'company',
    ),
);
```

### childrenEntitiesSelector function

`childrenEntitiesSelector` is a function which creates a predefined **relationship selector factory**.
The goal here is to simply the process of creating **relationship selectors** with [`childrenEntities`](#childrenentities-function).

```ts
declare function childrenEntitiesSelector(
    selector,
    keyId,
    keyValue
)
```

It's parameters are the same as [`childrenEntities`](#childrenentities-function) has, but without relationships.

```ts
const company = rootEntitySelector(selectCompanyState);
const companyStaff = childrenEntitiesSelector(
    selectUserState,
    'companyId',
    'staff',
);

// later.
const company1 = company(
    selectUserState(),
);

// the same as.
const company2 = rootEntity(
    selectCompanyState,
    childrenEntities(
        selectUserState,
        'companyId',
        'staff',
    ),
);
```

### rootEntities function

`rootEntities` is a **root selector factory** which helps to fetch an array of entities.
its call produces a **root selector** which can be used with **Redux** and **NGRX**.

```ts
declare function rootEntities(
    rootSelector
)
```

- `rootSelector` - is a **root selector** which has been produced by `rootEntity` function.

```ts
const selectUsers = rootEntities(selectUser);
```

### relationships pipe operator

`relationships` is a RxJS pipe operator which is useful when we already have a stream of existing entities
and would like to extend them with relationships.

For that we need:
- the `store` object
- a **root selector** we want to apply
- an observable stream of entities

Let's pretend we have a `user$` stream which emits a user entity time to time.
Then we could extend it with the next operation.
```ts
const userWithRelationships$ = user$.pipe(
    // a user w/o relationships.
    relationships(store, selectUser),
    // now a user w/ relationships.
);
```

The same can be done for a stream that emits an array of users.
In this case the **root selector** for arrays should be used.
```ts
const usersWithRelationships$ = users$.pipe(
    // users w/o relationships.
    relationships(store, selectUsers),
    // now users w/ relationships.
);
```

### rootEntityFlags options

There is a flag `rootEntityFlags.disabled` that may be useful for disabling selectors during updates of entities
in order to avoid unwanted triggers of selectors.
Simply set it to `true` before you start update and back to `false` afterwards.

**When you set it back to `false` you need to shake the store to get updated entities in selectors**.

### Types

There is a list of recommended types.

#### HANDLER_ENTITY

Simplifies definition of `HANDLER_ROOT_ENTITY`:
```ts
const selectUser1: HANDLER_ENTITY<User> = rootEntity(/*...*/);
// instead of
const selectUser2: HANDLER_ROOT_ENTITY<StoreState, User, User, string> = rootEntity(/*...*/);
```

#### HANDLER_ENTITIES

Simplifies definition of `HANDLER_ROOT_ENTITIES`:
```ts
const selectUsers1: HANDLER_ENTITIES<User> = rootEntities(/*...*/);
// instead of
const selectUsers2: HANDLER_ROOT_ENTITIES<StoreState, User, User, string> = rootEntities(/*...*/);
```

### Releasing cache

Every function of the library which produces selectors returns a shape that has `release` function.
Its behavior and purpose is the same as
[Memoized Selectors](https://ngrx.io/guide/store/selectors#resetting-memoized-selectors) of `@ngrx/store`.
Once you do not need a selector simply call `release` to reset the memoized value.
```ts
const selectUser = rootEntity(selectUserState);
store.select(selectUser, 1).subsribe(user => {
    // ...some activity
    selectUser.release();
});
```

### Usage with createSelector from NGRX

Imagine, there are two selectors:
- a selector that returns the id of a current user

  ```ts
  export const selectCurrentUserId = createSelector(
      selectUserState,
      feature => feature.currentUserId,
   );
   ```  

- a **root selector** for users with relationships

  ```ts
  export const selectUserWithCompany = rootEntity(
      selectUserState,
      relatedEntity(
          selectCompanyFeature,
          'companyId',
          'company',
      ),
  );
  ```

Then we have 3 options:

- usage of `switchMap`, but it is ugly

  ```ts
  // selecting the id of a current user
  store.select(selectCurrentUserId).pipe(
      // selecting the user with desired relationships
      switchMap(id => store.select(selectUserWithCompany, id)),
  ).subscribe(user => {
      // profit
  });
  ```

- combine them together via `createSelector` function, but it is a bit uncomfortable

  ```ts
  export const selectCurrentUser = createSelector(
      s => s, // selecting the whole store
      selectCurrentUserId, // selecting the id of a current user
      selectUserWithCompany, // selecting the user with desired relationships
  );
  
  store
      .select(selectCurrentUser)
      .subscribe(user => {
          // profit
      });
  ```

- pass an id selector as a parameter, quite short

  ```ts
  // selecting the user with desired relationships
  store
      .select(selectUserWithCompany, selectCurrentUserId)
      .subscribe(user => {
          // profit
      });
  ```

### Gathering information about selectors

Besides the `release` function, every selector from the library provides information about itself:

- `ngrxEntityRelationship` - name of its function: `rootEntity`, `rootEntities`, `relatedEntity`, `childEntity` and `childrenEntities`.
- `collectionSelector` - the related entity state selector.
- `idSelector` - a function which returns ids of entities.
- `relationships` - an array of passed **relationship selectors**.

There are two more keys in case of **relationship selectors**:

- `keyId` - a name of the keyId field.
- `keyValue` - a name of the keyValue field.

## Store normalization in Redux and NGRX

All **root selectors** from the library can be used to update the store with normalized response data.

For that `ngrxEntityRelationshipReducer` should be added as a meta reducer:

```ts
// Redux
const store = createStore(ngrxEntityRelationshipReducer(rootReducer));
```

```ts
// NGRX
StoreModule.forRoot({/* ... */}, {
    metaReducers: [
        // ...
        ngrxEntityRelationshipReducer, // <- add this
    ],
})
```

After that [`reduceFlat`](#reduceflat--reduceflat-action) action and [`reduceGraph`](#reducegraph--reducegraph-action) action can be used.

### ReduceFlat / reduceFlat action

This action helps to add to store data from a flat response.

Imagine, a backend returns the next flat shape:
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

There is a selector that fetches this data from the store (it has to have meta info `flatKey`):
```ts
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

```ts
// Redux
store.dispatch(reduceFlat({
    data: response,
    selector: selectUser,
}));
```

```ts
// NGRX
this.store.dispatch(reduceFlat({
  data: response,
  selector: selectUser,
}));
// or
this.store.dispatch(new ReduceFlat(response, selectUser));
```

### ReduceGraph / reduceGraph action

This action helps to add to store data from a graph response.

Imagine a backend returns the next nested shape of user:
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

There is a selector that fetches this data from the store:
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
store.dispatch(reduceGraph({
    data: response,
    selector: selectUser,
}));
```

```ts
// NGRX
this.store.dispatch(reduceGraph({
  data: response,
  selector: selectUser,
}));
// or
this.store.dispatch(new ReduceGraph(response, selectUser));
```

## Transform an entity to a class instance

[`rootEntity`](#rootentity-function) and [`rootEntitySelector`](#rootentityselector-function) of the library support a `<T>(entity: T) => T` callback.
It should be specified as the latest parameter, but before relationships definition.
The transformation happens once on the final root entity when all relationships have been already fulfilled.

```ts
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

-   The same entity selected directly from the store and selected by a **root selector** is a different object after.

    It allows to avoid side effects and circular references

-   A selector changes pointers of its entity only in case if the root or nested entity has been updated in the store.

    Or if [`release`](#releasing-cache) has been called before.

-   A value of any related key can be `undefined`.

## Troubleshooting

### Circular dependency

`WARNING in Circular dependency detected` - simply repeat the rule #1 and put created selectors into a separate file.

A file where we have feature selectors (anything, but not selectors with relationships): `store.ts`
```ts
export const selectUserState = createFeatureSelector<fromUser.State>('users');
export const selectCompanyState = createFeatureSelector<fromCompany.State>('companies');
export const selectAddressState = createFeatureSelector<fromAddress.State>('addresses');
```

A separate file where we import all feature selectors and declare combined selectors with relationships: `selectors.ts`
```ts
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

```ts
const selectUser: HANDLER_ENTITY<User> = rootEntity(/*...*/);
const selectUsers: HANDLER_ENTITIES<User> = rootEntities(/*...*/);
```
