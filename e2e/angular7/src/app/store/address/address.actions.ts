import {createAction, props} from '@ngrx/store';

import {Address} from './address.model';

export const setAddress = createAction('[Address/API] Set Address', props<{address: Address}>());
