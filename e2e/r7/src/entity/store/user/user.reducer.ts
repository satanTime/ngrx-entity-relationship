import {createReducer, Dictionary} from '@reduxjs/toolkit';

import {updateUser, upsertUser} from './user.actions';
import {User} from './user.model';

export interface UserState {
    ids: Array<string> | Array<number>;
    entities: Dictionary<User>;
    selectedIds: Array<string>;
}

export const initialState: UserState = {
    ids: [],
    entities: {},
    selectedIds: ['user1', 'user3', 'user6'],
};

export const userReducer = createReducer(initialState, builder => {
    builder
        .addCase(upsertUser, (state, action) => {
            return {
                ...state,
                id: [...state.ids],
                entities: {
                    ...state.entities,
                    [action.payload.user.id]: action.payload.user,
                },
            };
        })
        .addCase(updateUser, (state, action) => {
            const entity: User = {
                ...state.entities[action.payload.user.id],
                ...action.payload.user.changes,
            } as any;

            return {
                ...state,
                entities: {
                    ...state.entities,
                    [action.payload.user.id]: entity,
                },
            };
        });
});
