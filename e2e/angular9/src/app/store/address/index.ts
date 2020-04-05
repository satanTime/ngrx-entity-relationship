import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromAddress from './address.reducer';

export const selectAddressState = createFeatureSelector<fromAddress.State>('addresses');

export const selectAddressIds = createSelector(selectAddressState, fromAddress.selectAddressIds);
export const selectAddressEntities = createSelector(selectAddressState, fromAddress.selectAddressEntities);
export const selectAddress = createSelector(selectAddressState, (state, addressId: string) => {
    return state.entities[addressId];
});
export const selectAddressAll = createSelector(selectAddressState, fromAddress.selectAllAddresses);
export const selectAddressTotal = createSelector(selectAddressState, fromAddress.selectAddressTotal);
