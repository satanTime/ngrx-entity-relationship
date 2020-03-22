import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {selectAddressState} from 'src/app/store/address';
import {selectCompanyState} from 'src/app/store/company';
import {relatedEntity, rootEntities, rootEntity} from 'src/ngrx-entity-relations';
import {relatedEntitySelector} from 'src/ngrx-entity-relations/relatedEntitySelector';
import {rootEntitySelector} from 'src/ngrx-entity-relations/rootEntitySelector';
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

const entityUser = rootEntitySelector(selectUserState);
const entityUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
const entityCompany = rootEntitySelector(selectCompanyState);
const entityCompanyStaff = relatedEntitySelector(selectUserState, 'staffId', 'staff');
const entityCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
const entityCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'addressId');
const entityAddress = rootEntitySelector(selectAddressState);
const entityAddressCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');

export const selectCompleteUser = rootEntity(
  selectUserState,
  relatedEntity(
    selectCompanyState,
    'companyId',
    'company',
    relatedEntity(
      selectUserState,
      'staffId',
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
);

export const selectCompleteUsers = rootEntities(
  selectUserState,
  relatedEntity(
    selectCompanyState,
    'companyId',
    'company',
    relatedEntity(
      selectUserState,
      'staffId',
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
