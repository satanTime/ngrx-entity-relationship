import {createAction, props} from '@ngrx/store';
import {Update, EntityMap, Predicate} from '@ngrx/entity';

import {Company} from './company.model';

export const loadCompanies = createAction('[Company/API] Load Companies', props<{companies: Company[]}>());
export const addCompany = createAction('[Company/API] Add Company', props<{company: Company}>());
export const setCompany = createAction('[Company/API] Set Company', props<{company: Company}>());
export const upsertCompany = createAction('[Company/API] Upsert Company', props<{company: Company}>());
export const addCompanies = createAction('[Company/API] Add Companies', props<{companies: Company[]}>());
export const upsertCompanies = createAction('[Company/API] Upsert Companies', props<{companies: Company[]}>());
export const updateCompany = createAction('[Company/API] Update Company', props<{company: Update<Company>}>());
export const updateCompanies = createAction('[Company/API] Update Companies', props<{companies: Update<Company>[]}>());
export const mapCompanies = createAction('[Company/API] Map Companies', props<{entityMap: EntityMap<Company>}>());
export const deleteCompany = createAction('[Company/API] Delete Company', props<{id: string}>());
export const deleteCompanies = createAction('[Company/API] Delete Companies', props<{ids: string[]}>());
export const deleteCompaniesByPredicate = createAction(
    '[Company/API] Delete Companies By Predicate',
    props<{predicate: Predicate<Company>}>(),
);
export const clearCompanies = createAction('[Company/API] Clear Companies');
