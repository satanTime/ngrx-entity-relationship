import {createAction, props} from '@ngrx/store';

import {Address} from './address.model';

export const upsertAddress = createAction('[Address/API] Upsert Address', props<{address: Address}>());
