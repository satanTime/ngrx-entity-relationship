import {Action} from '@ngrx/store';

import {User} from './user.model';

export enum UserActionTypes {
    UPSERT = '[User] Upsert User',
}

export class UpsertUser implements Action {
    readonly type = UserActionTypes.UPSERT;

    constructor(public payload: {user: User}) {}
}

export type UserActionsUnion = UpsertUser;
