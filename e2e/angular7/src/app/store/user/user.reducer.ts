import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {UserActionsUnion, UserActionTypes} from './user.actions';
import {User} from './user.model';

export interface State extends EntityState<User> {}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: State = adapter.getInitialState();

export function userReducerFunc(state: State = initialState, action: UserActionsUnion) {
    switch (action.type) {
        case UserActionTypes.UPSERT:
            return adapter.upsertOne(action.payload.user, state);
    }

    return state;
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
