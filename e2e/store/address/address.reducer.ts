import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

import {setAddress} from './address.actions';
import {Address} from './address.model';

export interface EntityStateAddress extends EntityState<Address> {}

export const adapter: EntityAdapter<Address> = createEntityAdapter<Address>();

export const initialState: EntityStateAddress = adapter.getInitialState();

const addressReducer = createReducer(
    initialState,
    on(setAddress, (state, {entity}) => {
        return adapter.setOne(entity, state);
    }),
);

export function addressReducerFunc(state: EntityStateAddress | undefined, action: Action): EntityStateAddress {
    return addressReducer(state, action);
}

// get the selectors
const {selectEntities} = adapter.getSelectors();

export const selectAddressEntities = selectEntities;
