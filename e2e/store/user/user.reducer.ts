import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

import {setUser} from './user.actions';
import {User} from './user.model';

export interface EntitStateUser extends EntityState<User> {}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: EntitStateUser = adapter.getInitialState();

const userReducer = createReducer(
    initialState,
    on(setUser, (state, {entity}) => {
        return adapter.setOne(entity, state);
    }),
);

export function userReducerFunc(state: EntitStateUser | undefined, action: Action): EntitStateUser {
    return userReducer(state, action);
}

// get the selectors
const {selectIds, selectEntities, selectAll, selectTotal} = adapter.getSelectors();

// select the array of user ids
export const selectUserIds = selectIds;

// select the dictionary of user entities
export const selectUserEntities = selectEntities;

// select the array of users
export const selectAllUsers = selectAll;

// select the total user count
export const selectUserTotal = selectTotal;
