import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';

import {User} from './user.model';

export enum UserActionTypes {
    UPSERT = '[User] Upsert User',
    UPDATE = '[User] Update User',
}

export class UpsertUser implements Action {
    readonly type = UserActionTypes.UPSERT;

    constructor(public payload: {user: User}) {}
}

export class UpdateUser implements Action {
    readonly type = UserActionTypes.UPDATE;

    constructor(public payload: {user: Update<User>}) {}
}

export type UserActionsUnion = UpsertUser | UpdateUser;
