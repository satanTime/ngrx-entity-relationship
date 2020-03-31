import {createSelector, createFeatureSelector, ActionReducerMap, defaultMemoize} from '@ngrx/store';
import * as fromAddress from './address.reducer';

export interface State {
    addresses: fromAddress.State;
}

export const reducers: ActionReducerMap<State> = {
    addresses: fromAddress.addressReducerFunc,
};

export const selectAddressState = createFeatureSelector<fromAddress.State>('addresses');

export const selectAddressIds = createSelector(selectAddressState, fromAddress.selectAddressIds);
export const selectAddressEntities = createSelector(selectAddressState, fromAddress.selectAddressEntities);
export const selectAddress = createSelector(selectAddressState, (state, addressId: string) => {
    return state.entities[addressId];
});
export const selectAddressAll = createSelector(selectAddressState, fromAddress.selectAllAddresses);
export const selectAddressTotal = createSelector(selectAddressState, fromAddress.selectAddressTotal);
export const selectCurrentAddressId = createSelector(selectAddressState, fromAddress.getSelectedAddressId);

export const selectCurrentAddress = createSelector(
    selectAddressEntities,
    selectCurrentAddressId,
    (addressEntities, addressId) => addressEntities[addressId],
);
