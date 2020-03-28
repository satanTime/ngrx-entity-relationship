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

const entityUser = rootEntitySelector(selectUserState, (entity) => ({...entity, cloned: true}),);
const entityUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company', (entity) => ({...entity, cloned: true}),);
const entityCompany = rootEntitySelector(selectCompanyState, (entity) => ({...entity, cloned: true}),);
const entityCompanyStaff = childrenEntitySelector(selectUserState, 'companyId', 'staff', (entity) => ({...entity, cloned: true}));
const entityCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin', (entity) => ({...entity, cloned: true}),);
const entityCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address', (entity) => ({...entity, cloned: true}),);
const entityAddress = rootEntitySelector(selectAddressState, (entity) => ({...entity, cloned: true}),);
const entityAddressCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company', (entity) => ({...entity, cloned: true}),);

export const selectCompleteUser = rootEntity(
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
