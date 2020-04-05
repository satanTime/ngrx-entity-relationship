import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';
import * as AddressActions from './address.actions';
import {Address} from './address.model';

export interface State extends EntityState<Address> {}

export const adapter: EntityAdapter<Address> = createEntityAdapter<Address>();

export const initialState: State = adapter.getInitialState();

const addressReducer = createReducer(
    initialState,
    on(AddressActions.upsertAddress, (state, {address}) => {
        return adapter.upsertOne(address, state);
    }),
);

export function addressReducerFunc(state: State | undefined, action: Action) {
    return addressReducer(state, action);
}

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
