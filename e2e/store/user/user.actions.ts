import {createAction, props} from '@ngrx/store';

import {User} from './user.model';

export const setUser = createAction('user', props<{entity: User}>());
