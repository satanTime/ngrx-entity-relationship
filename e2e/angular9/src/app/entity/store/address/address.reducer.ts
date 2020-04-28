import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {AddressActionsUnion, AddressActionTypes} from './address.actions';
import {Address} from './address.model';

export interface State extends EntityState<Address> {}

export const adapter: EntityAdapter<Address> = createEntityAdapter<Address>();

export const initialState: State = adapter.getInitialState();

export function reducer(state: State = initialState, action: AddressActionsUnion) {
    switch (action.type) {
        case AddressActionTypes.UPSERT:
            return adapter.upsertOne(action.payload.address, state);
        case AddressActionTypes.UPDATE:
            return adapter.updateOne(action.payload.address, state);
    }

    return state;
}
