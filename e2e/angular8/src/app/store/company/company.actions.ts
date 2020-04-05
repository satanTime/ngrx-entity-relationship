import {createAction, props} from '@ngrx/store';

import {Company} from './company.model';

export const upsertCompany = createAction('[Company/API] Upsert Company', props<{company: Company}>());
