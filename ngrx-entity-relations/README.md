```typescript
import {createFeatureSelector} from '@ngrx/store';
import {EntityState} from '@ngrx/entity';
import {relatedEntity, rootEntities, rootEntity} from 'ngrx-entity-relations';

const selectUserState = createFeatureSelector<EntityState<User>>('users');
const selectCompanyState = createFeatureSelector<EntityState<Company>>('companies');
const selectAddressState = createFeatureSelector<EntityState<Address>>('addresses');

export const selectUser = rootEntity(
  selectUserState,
  relatedEntity(
    selectCompanyState, 'companyId', 'company',
    relatedEntity(
      selectUserState, 'staffId', 'staff',
    ),
    relatedEntity(
      selectUserState, 'adminId', 'admin',
    ),
    relatedEntity(
      selectAddressState, 'addressId', 'address',
      relatedEntity(
        selectCompanyState, 'companyId', 'company',
      ),
    ),
  ),
);

export const selectUsers = rootEntities(
  selectUserState,
  relatedEntity(
    selectCompanyState, 'companyId', 'company',
    relatedEntity(
      selectUserState, 'staffId', 'staff',
    ),
    relatedEntity(
      selectUserState, 'adminId', 'admin',
    ),
    relatedEntity(
      selectAddressState, 'addressId', 'address',
      relatedEntity(
        selectCompanyState, 'companyId', 'company',
      ),
    ),
  ),
);
```

with predefined selectors
```typescript
import {createFeatureSelector} from '@ngrx/store';
import {EntityState} from '@ngrx/entity';
import {relatedEntitySelector, rootEntitiesSelector, rootEntitySelector} from 'ngrx-entity-relations';

const selectUserState = createFeatureSelector<EntityState<User>>('users');
const selectCompanyState = createFeatureSelector<EntityState<Company>>('companies');
const selectAddressState = createFeatureSelector<EntityState<Address>>('addresses');

const entityUser = rootEntitySelector(selectUserState);
const entityUsers = rootEntitiesSelector(selectUserState);
const entityUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
const entityCompanyStaff = relatedEntitySelector(selectUserState, 'staffId', 'staff');
const entityCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
const entityCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'addressId');
const entityAddressCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');

export const selectUser = entityUser(
  entityUserCompany(
    entityCompanyStaff(),
    entityCompanyAdmin(),
    entityCompanyAddress(
      entityAddressCompany(),
      entityCompanyAdmin(),
    ),
  ),
);

export const selectUsers = entityUsers(
  entityUserCompany(
    entityCompanyStaff(),
    entityCompanyAdmin(),
    entityCompanyAddress(
      entityAddressCompany(),
    ),
  ),
);
```

```typescript
this.store.select(selectUser, 'userId');
this.store.select(selectUsers, ['user1', 'user2', 'user3']);
```
