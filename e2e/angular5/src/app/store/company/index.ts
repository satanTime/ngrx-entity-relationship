import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromCompany from './company.reducer';

export const selectCompanyState = createFeatureSelector<fromCompany.State>('companies');

export const selectCompanyIds = createSelector(selectCompanyState, fromCompany.selectCompanyIds);
export const selectCompanyEntities = createSelector(selectCompanyState, fromCompany.selectCompanyEntities);
export const selectCompany = createSelector(selectCompanyState, (state, companyId: string) => {
    return state.entities[companyId];
});
export const selectCompanyAll = createSelector(selectCompanyState, fromCompany.selectAllCompanies);
export const selectCompanyTotal = createSelector(selectCompanyState, fromCompany.selectCompanyTotal);
