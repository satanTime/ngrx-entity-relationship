import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Action, createReducer, on} from '@ngrx/store';
import * as CompanyActions from './company.actions';
import {Company} from './company.model';

export interface State extends EntityState<Company> {}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();

export const initialState: State = adapter.getInitialState();

const companyReducer = createReducer(
    initialState,
    on(CompanyActions.upsertCompany, (state, {company}) => {
        return adapter.upsertOne(company, state);
    }),
);

export function companyReducerFunc(state: State | undefined, action: Action) {
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
