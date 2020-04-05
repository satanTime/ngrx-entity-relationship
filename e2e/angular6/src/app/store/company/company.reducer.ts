import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {CompanyActionsUnion, CompanyActionTypes} from './company.actions';
import {Company} from './company.model';

export interface State extends EntityState<Company> {}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();

export const initialState: State = adapter.getInitialState();

export function companyReducerFunc(state: State = initialState, action: CompanyActionsUnion) {
    switch (action.type) {
        case CompanyActionTypes.UPSERT:
            return adapter.upsertOne(action.payload.company, state);
    }

    return state;
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
