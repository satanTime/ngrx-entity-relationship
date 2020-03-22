```typescript
import {createFeatureSelector} from '@ngrx/store';
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

```typescript
this.store.select(selectUser, 'userId');
this.store.select(selectUsers, ['user1', 'user2', 'user3']);
```
