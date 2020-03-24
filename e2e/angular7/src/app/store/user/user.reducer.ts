import {Action} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {User} from './user.model';
import * as UserActions from './user.actions';

export interface State extends EntityState<User> {
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: State = adapter.getInitialState();

export function userReducerFunc(state: State | undefined, action: Action) {
  if (action.type === UserActions.setUser.type) {
    return adapter.upsertOne((action as any).user, state);
  }
  return state;
}

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// select the array of user ids
export const selectUserIds = selectIds;

// select the dictionary of user entities
export const selectUserEntities = selectEntities;

// select the array of users
export const selectAllUsers = selectAll;

// select the total user count
export const selectUserTotal = selectTotal;
