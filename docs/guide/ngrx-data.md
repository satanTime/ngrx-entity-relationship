---
description: A guide how to build and use selectors to fetch related entities in Angular applications with @ngrx/data
---

Based on [ngrx docs](https://ngrx.io/guide/data/entity-collection-service#examples-from-the-demo-app)
we should have 3 entity collection services.

```ts
const userService = EntityCollectionServiceFactory
  .create<User>(
    'users',
  );
const companyService = EntityCollectionServiceFactory
  .create<Company>(
    'companies',
  );
const addressService = EntityCollectionServiceFactory
  .create<Address>(
    'addresses',
  );
```

Or later based on [ngrx docs](https://ngrx.io/guide/data/entity-collection-service#create-the-entitycollectionservice-as-a-class)
we may have 3 own services which extend `EntityCollectionServiceBase<T>`.

```ts
const userService: UserEntityService;
const companyService: CompanyEntityService;
const addressService: AddressEntityService;
```

For `ngrx-entity-relationship` both will work.

What we should keep in mind is that `@ngrx/data` is built on services.
Therefore, our selectors for related entities should be provided via services too.

So, let's simply create a service that injects the services as dependencies, and defines **root selectors** which return entities with relationships.
The approach is the same as for `@ngrx/store` and `@ngrx/entity`,
we need [`rootEntity`](../api/core/rootentity-function.md) and [`relatedEntity`](../api/core/rootentityselector-function.md) functions from `ngrx-entity-relationship`,
but instead of defining selectors in files, we should define them in the service.

```ts
@Injectable({providedIn: 'root'})
export class UserSelectorService {
  // important dependencies
  constructor(
    private store: Store,
    private user: UserEntityService,
    private company: CompanyEntityService,
    private serviceFactory: EntityCollectionServiceFactory,
  ) {}

  // a root selector for single users
  public readonly selectUser =
    rootEntity(
      // @ngrx/data service of the User entity.
      this.user,

      // user.company
      relatedEntity(
        // @ngrx/data service of the Company entity.
        this.company,
        // the key in the user's model
        // that points to the company id.
        'companyId',
        // the key in the user's model
        // where the company entity will be set.
        'company',

        // company.address
        childEntity(
          // creating @ngrx/data service of the Address entity.
          this.serviceFactory
            .create<Address>('addresses'),
          // the key in the company's model
          // that points to the address id.
          'addressId',
          // the key in the company's model
          // where the address entity will be set.
          'address',
        ),
      ),
    );
}
```

Besides single users, we can select an array of users.
For that, we need [`rootEntities`](../api/core/rootentities-function.md).

```ts
export class UserSelectorService {
  // ...
  // a root selector for arrays of users
  public readonly selectUsers = rootEntities(
    // simply pass here a select for a single entity.
    this.selectUser,
  );
  // ...
}
```

Now, to use the selectors, we need to inject the created service with **root selectors** in desired components:

```ts
export class MyComponent {
  constructor(
      store: Store,
      userSelectors: UserSelectorService,
  ) {
    this.user$ = store.select(
      userSelectors.selectUser,
      '1',
    );
    this.users$ = store.select(
      userSelectors.selectUsers,
      ['1', '2'],
    );
  }
}
```

Profit.
