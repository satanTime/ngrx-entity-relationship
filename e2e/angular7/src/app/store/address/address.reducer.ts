import {Action} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {Address} from './address.model';
import * as AddressActions from './address.actions';

export interface State extends EntityState<Address> {}

export const adapter: EntityAdapter<Address> = createEntityAdapter<Address>();

export const initialState: State = adapter.getInitialState();

export function addressReducerFunc(state: State | undefined = initialState, action: Action) {
  switch (action.type) {
    case AddressActions.setAddress.type: {
      return adapter.upsertOne((action as any).address, state);
    }
  }
  return state;
}

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// select the array of address ids
export const selectAddressIds = selectIds;

// select the dictionary of address entities
export const selectAddressEntities = selectEntities;

// select the array of addresses
export const selectAllAddresses = selectAll;

// select the total address count
export const selectAddressTotal = selectTotal;
