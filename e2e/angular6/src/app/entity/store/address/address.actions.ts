import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';

import {Address} from './address.model';

export enum AddressActionTypes {
    UPSERT = '[Address] Upsert Address',
    UPDATE = '[Address] Update Address',
}

export class UpsertAddress implements Action {
    readonly type = AddressActionTypes.UPSERT;

    constructor(public payload: {address: Address}) {}
}

export class UpdateAddress implements Action {
    readonly type = AddressActionTypes.UPDATE;

    constructor(public payload: {address: Update<Address>}) {}
}

export type AddressActionsUnion = UpsertAddress | UpdateAddress;
