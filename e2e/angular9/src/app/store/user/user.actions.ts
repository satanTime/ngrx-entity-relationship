import {createAction, props} from '@ngrx/store';

import {User} from './user.model';

export const upsertUser = createAction('[User/API] Upsert User', props<{user: User}>());
