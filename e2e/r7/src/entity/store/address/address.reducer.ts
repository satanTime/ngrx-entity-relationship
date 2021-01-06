import {createReducer, Dictionary} from '@reduxjs/toolkit';

import {updateAddress, upsertAddress} from './address.actions';
import {Address} from './address.model';

export interface AddressState {
    existingIds: Array<string>;
    byIds: Dictionary<Address>;
}

export const initialState: AddressState = {
    existingIds: [],
    byIds: {},
};

export const addressReducer = createReducer(initialState, builder => {
    builder
        .addCase(upsertAddress, (state, action) => {
            return {
                ...state,
                existingIds: [...state.existingIds, action.payload.address.id],
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
