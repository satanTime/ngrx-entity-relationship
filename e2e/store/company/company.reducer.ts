import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';

import {setCompany} from './company.actions';
import {Company} from './company.model';

export interface EntityStateCompany extends EntityState<Company> {}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();

export const initialState: EntityStateCompany = adapter.getInitialState();

const companyReducer = createReducer(
    initialState,
    on(setCompany, (state, {entity}) => {
        return adapter.setOne(entity, state);
    }),
);

export function companyReducerFunc(state: EntityStateCompany | undefined, action: Action): EntityStateCompany {
    return companyReducer(state, action);
}

// get the selectors
const {selectIds, selectEntities, selectAll, selectTotal} = adapter.getSelectors();

// select the array of company ids
export const selectCompanyIds = selectIds;

// select the dictionary of company entities
export const selectCompanyEntities = selectEntities;

// select the array of companies
export const selectAllCompanies = selectAll;

// select the total company count
export const selectCompanyTotal = selectTotal;
