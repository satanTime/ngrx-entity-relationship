import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {selectAddressState} from 'src/app/store/address';
import {selectCompanyState} from 'src/app/store/company';
import {relatedEntitySelector, rootEntitySelector} from 'src/ngrx-entity-relations';
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

export const selectCompleteUser = rootEntitySelector(
  selectUserState,
  relatedEntitySelector(
    selectCompanyState,
    'companyId',
    'company',
    relatedEntitySelector(
      selectUserState,
      'staffId',
      'staff',
    ),
    relatedEntitySelector(
      selectUserState,
      'adminId',
      'admin',
    ),
    relatedEntitySelector(
      selectAddressState,
      'addressId',
      'address',
      relatedEntitySelector(
        selectCompanyState,
        'companyId',
        'company',
      ),
    ),
  ),
);
