import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';
import * as UserActions from './user.actions';
import {User} from './user.model';

export interface State extends EntityState<User> {}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
    selectId: v => v.userId,
});

export const initialState: State = adapter.getInitialState();

const userReducer = createReducer(
    initialState,
    on(UserActions.upsertUser, (state, {user}) => {
        return adapter.upsertOne(user, state);
    }),
);

export function userReducerFunc(state: State | undefined, action: Action) {
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
