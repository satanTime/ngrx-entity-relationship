import {createAction, props} from '@ngrx/store';

import {Company} from './company.model';

export const setCompany = createAction('company', props<{entity: Company}>());
