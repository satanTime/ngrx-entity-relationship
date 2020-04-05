import {Action} from '@ngrx/store';

import {Address} from './address.model';

export enum AddressActionTypes {
    UPSERT = '[Address] Upsert Address',
}

export class UpsertAddress implements Action {
    readonly type = AddressActionTypes.UPSERT;

    constructor(public payload: {address: Address}) {}
}

export type AddressActionsUnion = UpsertAddress;
