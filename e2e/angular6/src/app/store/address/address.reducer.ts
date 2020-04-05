import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {AddressActionsUnion, AddressActionTypes} from './address.actions';
import {Address} from './address.model';

export interface State extends EntityState<Address> {}

export const adapter: EntityAdapter<Address> = createEntityAdapter<Address>();

export const initialState: State = adapter.getInitialState();

export function addressReducerFunc(state: State = initialState, action: AddressActionsUnion) {
    switch (action.type) {
        case AddressActionTypes.UPSERT:
            return adapter.upsertOne(action.payload.address, state);
    }

    return state;
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
