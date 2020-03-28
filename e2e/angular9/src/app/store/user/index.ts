import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {
    childEntity,
    childrenEntity,
    childrenEntitySelector,
    relatedEntity,
    relatedEntitySelector,
    rootEntities,
    rootEntity,
    rootEntitySelector,
} from 'ngrx-entity-relationship';
import {selectAddressState} from 'src/app/store/address';
import {selectCompanyState} from 'src/app/store/company';
import * as fromUser from './user.reducer';

export interface State {
  users: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
  users: fromUser.userReducerFunc,
};

export const selectUserState = createFeatureSelector<fromUser.State>('users');

export const selectUser = createSelector(
  selectUserState,
  (state, userId: string) => {
    return state.entities[userId];
  },
);
export const selectUserIds = createSelector(
  selectUserState,
  fromUser.selectUserIds // shorthand for usersState => fromUser.selectUserIds(usersState)
);
export const selectUserEntities = createSelector(
  selectUserState,
  fromUser.selectUserEntities
);
export const selectUserAll = createSelector(
  selectUserState,
  fromUser.selectAllUsers
);
export const selectUserTotal = createSelector(
  selectUserState,
  fromUser.selectUserTotal
);

const transformedUser = rootEntitySelector(selectUserState, (entity) => ({...entity, cloned: true}));
const transformedUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company', (entity) => ({...entity, cloned: true}));
const transformedCompany = rootEntitySelector(selectCompanyState, (entity) => ({...entity, cloned: true}));
const transformedCompanyStaff = childrenEntitySelector(selectUserState, 'companyId', 'staff', (entity) => ({...entity, cloned: true}));
const transformedCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin', (entity) => ({...entity, cloned: true}));
const transformedCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address', (entity) => ({...entity, cloned: true}));
const transformedAddress = rootEntitySelector(selectAddressState, (entity) => ({...entity, cloned: true}));
const transformedAddressCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company', (entity) => ({...entity, cloned: true}));
const entityUser = rootEntitySelector(selectUserState);
const entityUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
const entityCompany = rootEntitySelector(selectCompanyState);
const entityCompanyStaff = childrenEntitySelector(selectUserState, 'companyId', 'staff');
const entityCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
const entityCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address');
const entityAddress = rootEntitySelector(selectAddressState);
const entityAddressCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');

export const selectCompleteUser = rootEntity(
  selectUserState,
  relatedEntity(
    selectCompanyState,
    'companyId',
    'company',
    childrenEntity(
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
      relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
      ),
    ),
  ),
  childrenEntity(
    selectUserState,
    'managerId',
    'employees',
  ),
    childEntity(
    selectUserState,
    'managerId',
    'employee',
  ),
);

export const selectTransformedUser = rootEntity(
  selectUserState,
  (entity) => ({...entity, cloned: true}),
  relatedEntity(
    selectCompanyState,
    'companyId',
    'company',
    (entity) => ({...entity, cloned: true}),
    childrenEntity(
      selectUserState,
      'companyId',
      'staff',
      (entity) => ({...entity, cloned: true}),
    ),
    relatedEntity(
      selectUserState,
      'adminId',
      'admin',
      (entity) => ({...entity, cloned: true}),
    ),
    relatedEntity(
      selectAddressState,
      'addressId',
      'address',
      (entity) => ({...entity, cloned: true}),
      relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
        (entity) => ({...entity, cloned: true}),
      ),
    ),
  ),
  childrenEntity(
    selectUserState,
    'managerId',
    'employees',
    (entity) => ({...entity, cloned: true}),
  ),
  childEntity(
    selectUserState,
    'managerId',
    'employee',
    (entity) => ({...entity, cloned: true}),
  ),
);

export const selectCompleteUsers = rootEntities(
  selectUserState,
  (entity) => ({...entity, cloned: true}),
  relatedEntity(
    selectCompanyState,
    'companyId',
    'company',
    (entity) => ({...entity, cloned: true}),
    childrenEntity(
      selectUserState,
      'companyId',
      'staff',
      (entity) => ({...entity, cloned: true}),
    ),
    relatedEntity(
      selectUserState,
      'adminId',
      'admin',
      (entity) => ({...entity, cloned: true}),
    ),
    relatedEntity(
      selectAddressState,
      'addressId',
      'address',
      (entity) => ({...entity, cloned: true}),
      relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
        (entity) => ({...entity, cloned: true}),
      ),
    ),
  ),
);

export const selectSimpleUser = entityUser(
  entityUserCompany(
    entityCompanyStaff(),
    entityCompanyAdmin(),
    entityCompanyAddress(
      entityAddressCompany(),
      entityCompanyAdmin(),
    ),
  ),
);

export const selectSimpleTransformedUser = transformedUser(
  transformedUserCompany(
      transformedCompanyStaff(),
      transformedCompanyAdmin(),
      transformedCompanyAddress(
          transformedAddressCompany(),
          transformedCompanyAdmin(),
    ),
  ),
);
