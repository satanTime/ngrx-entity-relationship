import {createAction, props} from '@ngrx/store';

import {Address} from './address.model';

export const setAddress = createAction('address', props<{entity: Address}>());
