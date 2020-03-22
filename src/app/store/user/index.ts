import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap, defaultMemoize,
} from '@ngrx/store';
import * as fromUser from './user.reducer';

export interface State {
  users: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
  users: fromUser.userReducerFunc,
};

export const selectUserState = createFeatureSelector<fromUser.State>('users');

export const selectUserIds = createSelector(
  selectUserState,
  fromUser.selectUserIds // shorthand for usersState => fromUser.selectUserIds(usersState)
);
export const selectUserEntities = createSelector(
  selectUserState,
  fromUser.selectUserEntities
);
export const selectUser = createSelector(
  selectUserState,
  (state, userId: string) => {
    console.log(state, userId);
    return state.entities[userId];
  },
);
export const selectUserAll = createSelector(
  selectUserState,
  fromUser.selectAllUsers
);
export const selectUserTotal = createSelector(
  selectUserState,
  fromUser.selectUserTotal
);
export const selectCurrentUserId = createSelector(
  selectUserState,
  fromUser.getSelectedUserId
);

export const selectCurrentUser = createSelector(
  selectUserEntities,
  selectCurrentUserId,
  (userEntities, userId) => userEntities[userId]
);
