import {Action} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {Company} from './company.model';
import * as CompanyActions from './company.actions';

export interface State extends EntityState<Company> {
}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();

export const initialState: State = adapter.getInitialState();

export function companyReducerFunc(state: State | undefined = initialState, action: Action) {
  if (action.type === CompanyActions.setCompany.type) {
    return adapter.upsertOne((action as any).company, state);
  }
  return state;
}

// get the selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// select the array of company ids
export const selectCompanyIds = selectIds;

// select the dictionary of company entities
export const selectCompanyEntities = selectEntities;

// select the array of companies
export const selectAllCompanies = selectAll;

// select the total company count
export const selectCompanyTotal = selectTotal;
