import {createAction, props} from '@ngrx/store';
import {Update, EntityMap, Predicate} from '@ngrx/entity';

import {Address} from './address.model';

export const loadAddresses = createAction('[Address/API] Load Addresses', props<{addresses: Address[]}>());
export const addAddress = createAction('[Address/API] Add Address', props<{address: Address}>());
export const setAddress = createAction('[Address/API] Set Address', props<{address: Address}>());
export const upsertAddress = createAction('[Address/API] Upsert Address', props<{address: Address}>());
export const addAddresses = createAction('[Address/API] Add Addresses', props<{addresses: Address[]}>());
export const upsertAddresses = createAction('[Address/API] Upsert Addresses', props<{addresses: Address[]}>());
export const updateAddress = createAction('[Address/API] Update Address', props<{address: Update<Address>}>());
export const updateAddresses = createAction('[Address/API] Update Addresses', props<{addresses: Update<Address>[]}>());
export const mapAddresses = createAction('[Address/API] Map Addresses', props<{entityMap: EntityMap<Address>}>());
export const deleteAddress = createAction('[Address/API] Delete Address', props<{id: string}>());
export const deleteAddresses = createAction('[Address/API] Delete Addresses', props<{ids: string[]}>());
export const deleteAddressesByPredicate = createAction(
    '[Address/API] Delete Addresses By Predicate',
    props<{predicate: Predicate<Address>}>(),
);
export const clearAddresses = createAction('[Address/API] Clear Addresses');
