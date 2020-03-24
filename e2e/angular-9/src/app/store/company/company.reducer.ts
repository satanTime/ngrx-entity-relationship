import {Action, createReducer, on} from '@ngrx/store';
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {Company} from './company.model';
import * as CompanyActions from './company.actions';

export interface State extends EntityState<Company> {
  // additional entities state properties
  selectedCompanyId: number | null;
}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedCompanyId: null,
});

const companyReducer = createReducer(
  initialState,
  on(CompanyActions.addCompany, (state, {company}) => {
    return adapter.addOne(company, state);
  }),
  on(CompanyActions.setCompany, (state, {company}) => {
    return adapter.setOne(company, state);
  }),
  on(CompanyActions.upsertCompany, (state, {company}) => {
    return adapter.upsertOne(company, state);
  }),
  on(CompanyActions.addCompanies, (state, {companies}) => {
    return adapter.addMany(companies, state);
  }),
  on(CompanyActions.upsertCompanies, (state, {companies}) => {
    return adapter.upsertMany(companies, state);
  }),
  on(CompanyActions.updateCompany, (state, {company}) => {
    return adapter.updateOne(company, state);
  }),
  on(CompanyActions.updateCompanies, (state, {companies}) => {
    return adapter.updateMany(companies, state);
  }),
  on(CompanyActions.mapCompanies, (state, {entityMap}) => {
    return adapter.map(entityMap, state);
  }),
  on(CompanyActions.deleteCompany, (state, {id}) => {
    return adapter.removeOne(id, state);
  }),
  on(CompanyActions.deleteCompanies, (state, {ids}) => {
    return adapter.removeMany(ids, state);
  }),
  on(CompanyActions.deleteCompaniesByPredicate, (state, {predicate}) => {
    return adapter.removeMany(predicate, state);
  }),
  on(CompanyActions.loadCompanies, (state, {companies}) => {
    return adapter.addAll(companies, state);
  }),
  on(CompanyActions.clearCompanies, state => {
    return adapter.removeAll({...state, selectedCompanyId: null});
  }),
);

export function companyReducerFunc(state: State | undefined, action: Action) {
  return companyReducer(state, action);
}

export const getSelectedCompanyId = (state: State) => state.selectedCompanyId;

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
