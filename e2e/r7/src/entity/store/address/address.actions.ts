import {createAction} from '@reduxjs/toolkit';

import {Address} from './address.model';

export enum AddressActionTypes {
    UPSERT = '[Address] Upsert Address',
    UPDATE = '[Address] Update Address',
}

export const upsertAddress = createAction(AddressActionTypes.UPSERT, (payload: {address: Address}) => ({payload}));

export const updateAddress = createAction(
    AddressActionTypes.UPDATE,
    (payload: {address: {id: string; changes: Partial<Address>}}) => ({payload}),
);
