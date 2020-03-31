import {Action, createReducer, on} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {Address} from './address.model';
import * as AddressActions from './address.actions';

export interface State extends EntityState<Address> {
    // additional entities state properties
    selectedAddressId: number | null;
}

export const adapter: EntityAdapter<Address> = createEntityAdapter<Address>();

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
    selectedAddressId: null,
});

const addressReducer = createReducer(
    initialState,
    on(AddressActions.addAddress, (state, {address}) => {
        return adapter.addOne(address, state);
    }),
    on(AddressActions.setAddress, (state, {address}) => {
        return adapter.upsertOne(address, state);
    }),
    on(AddressActions.upsertAddress, (state, {address}) => {
        return adapter.upsertOne(address, state);
    }),
    on(AddressActions.addAddresses, (state, {addresses}) => {
        return adapter.addMany(addresses, state);
    }),
    on(AddressActions.upsertAddresses, (state, {addresses}) => {
        return adapter.upsertMany(addresses, state);
    }),
    on(AddressActions.updateAddress, (state, {address}) => {
        return adapter.updateOne(address, state);
    }),
    on(AddressActions.updateAddresses, (state, {addresses}) => {
        return adapter.updateMany(addresses, state);
    }),
    on(AddressActions.mapAddresses, (state, {entityMap}) => {
        return adapter.map(entityMap, state);
    }),
    on(AddressActions.deleteAddress, (state, {id}) => {
        return adapter.removeOne(id, state);
    }),
    on(AddressActions.deleteAddresses, (state, {ids}) => {
        return adapter.removeMany(ids, state);
    }),
    on(AddressActions.deleteAddressesByPredicate, (state, {predicate}) => {
        return adapter.removeMany(predicate, state);
    }),
    on(AddressActions.loadAddresses, (state, {addresses}) => {
        return adapter.addAll(addresses, state);
    }),
    on(AddressActions.clearAddresses, state => {
        return adapter.removeAll({...state, selectedAddressId: null});
    }),
);

export function addressReducerFunc(state: State | undefined, action: Action) {
    return addressReducer(state, action);
}

export const getSelectedAddressId = (state: State) => state.selectedAddressId;

// get the selectors
const {selectIds, selectEntities, selectAll, selectTotal} = adapter.getSelectors();

// select the array of address ids
export const selectAddressIds = selectIds;

// select the dictionary of address entities
export const selectAddressEntities = selectEntities;

// select the array of addresses
export const selectAllAddresses = selectAll;

// select the total address count
export const selectAddressTotal = selectTotal;
