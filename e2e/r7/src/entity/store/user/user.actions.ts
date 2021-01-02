import {createAction} from '@reduxjs/toolkit';

import {User} from './user.model';

export enum UserActionTypes {
    UPSERT = '[User] Upsert User',
    UPDATE = '[User] Update User',
}

export const upsertUser = createAction(UserActionTypes.UPSERT, (payload: {user: User}) => ({payload}));

export const updateUser = createAction(
    UserActionTypes.UPDATE,
    (payload: {user: {id: string; changes: Partial<User>}}) => ({payload}),
);
