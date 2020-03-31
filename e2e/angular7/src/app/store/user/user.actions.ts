import {createAction, props} from '@ngrx/store';

import {User} from './user.model';

export const setUser = createAction('[User/API] Set User', props<{user: User}>());
