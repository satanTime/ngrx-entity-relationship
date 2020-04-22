import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {UserActionsUnion, UserActionTypes} from './user.actions';
import {User} from './user.model';

export interface State extends EntityState<User> {
    selectedIds: Array<string>;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: State = adapter.getInitialState({
    selectedIds: ['user1', 'user3', 'user6'],
});

export function reducer(state: State = initialState, action: UserActionsUnion) {
    switch (action.type) {
        case UserActionTypes.UPSERT:
            return adapter.upsertOne(action.payload.user, state);
        case UserActionTypes.UPDATE:
            return adapter.updateOne(action.payload.user, state);
    }

    return state;
}
