import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {UpdateUser, UpsertUser, UserActionTypes} from './user.actions';
import {User} from './user.model';

export interface State extends EntityState<User> {
    selectedIds: Array<string>;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: State = adapter.getInitialState({
    selectedIds: ['user1', 'user3', 'user6'],
});

export function reducer(state: State | undefined = initialState, action: Action): State {
    switch (action.type) {
        case UserActionTypes.UPSERT:
            return adapter.upsertOne((<UpsertUser>action).payload.user, state);
        case UserActionTypes.UPDATE:
            return adapter.updateOne((<UpdateUser>action).payload.user, state);
    }

    return state;
}
