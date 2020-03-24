import {createAction, props} from '@ngrx/store';

import {Company} from './company.model';

export const setCompany = createAction('[Company/API] Set Company', props<{ company: Company }>());
