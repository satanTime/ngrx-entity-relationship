# A simple way to select related entities from a store.

Imagine that we have the next entities in ngrx store, every entity is stored in its own feature.
```typescript
export interface User {
  id: string;
  firstName: string;
  firstLast: string;
  company?: Company;
  companyId?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  country: string;
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

const selectUserState = createFeatureSelector<EntityState<User>>('users');
const selectCompanyState = createFeatureSelector<EntityState<Company>>('companies');
const selectAddressState = createFeatureSelector<EntityState<Address>>('addresses');

store.dispatch(setUser({
  user: {
    id: '1',
    firstName: "John",
    lastName: "Smith",
    companyId: '1',
  },
}));
store.dispatch(setCompany({
  company: {
    id: '1',
    name: 'Magic',
    adminId: '1',
    addressId: '1',
  },
}));
store.dispatch(setAddress({
  adress: {
    id: '1',
    street: 'Main st.',
    city: 'Town',
    country: 'Land',
    companyId: '1',
  },
}));
```

And now we want to get a user with the related company and its address.
To have the next structure by the end:
```typescript
const user = {
  id: '1',
  firstName: "John",
  lastName: "Smith",
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
      companyId: '1',
    },
  }
};
```
With the default adapter we can select only an entity without its nested entities.
```typescript
const userAdapter = createEntityAdapter<User>();
const userSelectors = userAdapter.getSelectors();

export const selectUserEntities = createSelector(
  selectUserState,
  userSelectors.selectEntities,
);

store.pipe(
  selectUserEntities,
  map(entities => entities['1']),
);
```

## The solution.
To solve the issue we need `rootEntity`, `relatedEntity` and `rootEntities` from `ngrx-entity-relationship`.
```typescript
export const selectUser = rootEntity(
  selectUserState, // selecting our root entity.
  relatedEntity( // now we define a relationship we want to add.
    selectCompanyState, // a selector of the related entity.
    'companyId', // the key in the root entity which points to the related entity.
    'company', // the key in the root entity where we'll set the related entity.
    relatedEntity( // now we define a relationship we want to add to the company.
      selectAddressState, // a selector of the related entity.
      'addressId', // the key with the id.
      'address', // the key where to set the result.
    ),
  ),
);
export const selectUsers = rootEntities( // the same but for a list.
  selectUserState,
  relatedEntity(selectCompanyState, 'companyId', 'company',
    relatedEntity(selectAddressState, 'addressId', 'address'),
  ),
);
```
Now we can use the selectors with the store.
```typescript
this.store.select(selectUser, 'userId');
this.store.select(selectUsers, ['user1', 'user2', 'user3']);
```

## Additional examples.
Of course we can select as many relationships as we want until we have a field with a related id.
Check how `childrenEntity` works. It gathers entities based on a parent field.
```typescript
export const selectUser = rootEntity(
  selectUserState,
  relatedEntity(
    selectCompanyState, 'companyId', 'company',
    childrenEntity(selectUserState, 'companyId', 'staff'),
    relatedEntity(selectUserState, 'adminId', 'admin'),
    relatedEntity(selectAddressState, 'addressId', 'address',
      relatedEntity(selectCompanyState, 'companyId', 'company'),
    ),
  ),
);
```
You can simplify the definition with predefined selectors.
Check how `childrenEntitySelector` works. It gathers entities based on a parent field.  
```typescript
const entityUser = rootEntitySelector(selectUserState);
const entityUsers = rootEntitiesSelector(selectUserState);
const entityUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
const entityCompanyStaff = childrenEntitySelector(selectUserState, 'companyId', 'staff');
const entityCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
const entityCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address');
const entityAddressCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');

export const selectUserWithCompany = entityUser(
  entityUserCompany(),
);
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

## Warnings.

* An entity from the same feature with the same id is a different object.
  
  It allows avoiding of circular references.

* A selector emits an updated entity only in case if the root or a nested related entity has been updated.

* A value of any related key can be `undefined`.

* There's a flag `rootEntityFlags.disabled` that can be useful to disable selectors during updates of entities.
  Simply set it to `true` before you start update and back to `false` after it.
  
  __When you set it to `false` you need to share the store to get updated entities__.
