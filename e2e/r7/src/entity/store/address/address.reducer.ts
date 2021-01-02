import {createReducer, Dictionary} from '@reduxjs/toolkit';

import {updateAddress, upsertAddress} from './address.actions';
import {Address} from './address.model';

export interface AddressState {
    ids: Array<string> | Array<number>;
    byIds: Dictionary<Address>;
}

export const initialState: AddressState = {
    ids: [],
    byIds: {},
};

export const addressReducer = createReducer(initialState, builder => {
    builder
        .addCase(upsertAddress, (state, action) => {
            return {
                ...state,
                id: [...state.ids],
                byIds: {
                    ...state.byIds,
                    [action.payload.address.id]: action.payload.address,
                },
            };
        })
        .addCase(updateAddress, (state, action) => {
            const entity: Address = {
                ...state.byIds[action.payload.address.id],
                ...action.payload.address.changes,
            } as any;

            return {
                ...state,
                byIds: {
                    ...state.byIds,
                    [action.payload.address.id]: entity,
                },
            };
        });
});
