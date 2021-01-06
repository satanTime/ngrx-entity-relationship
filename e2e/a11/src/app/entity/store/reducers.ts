import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {
    childEntitySelector,
    childrenEntitiesSelector,
    relatedEntitySelector,
    rootEntitySelector,
} from 'ngrx-entity-relationship';

import * as fromAddress from './address/address.reducer';
import * as fromCompany from './company/company.reducer';
import * as fromUser from './user/user.reducer';

export interface State {
    addresses: fromAddress.State;
    companies: fromCompany.State;
    users: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
    addresses: fromAddress.reducer,
    companies: fromCompany.reducer,
    users: fromUser.reducer,
};

// feature selectors
export const selectUserState = createFeatureSelector<fromUser.State>('users');
export const selectCompanyState = createFeatureSelector<fromCompany.State>('companies');
export const selectAddressState = createFeatureSelector<fromAddress.State>('addresses');

// id selectors
export const selectCurrentCompanyId = createSelector(selectCompanyState, s => s.selectedId);
export const selectCurrentUsersIds = createSelector(selectUserState, s => s.selectedIds);

// creating selector producers for User and its relationships
export const rootUser = rootEntitySelector(selectUserState);
export const relUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
export const relUserEmployees = childrenEntitiesSelector(selectUserState, 'managerId', 'employees');
export const relUserManager = relatedEntitySelector(selectUserState, 'managerId', 'manager');

// creating selector producers for Company and its relationships
export const rootCompany = rootEntitySelector(selectCompanyState);
export const relCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address');
export const relCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
export const relCompanyStaff = childrenEntitiesSelector(selectUserState, 'companyId', 'staff');

// creating selector producers for Address and its relationships
export const rootAddress = rootEntitySelector(selectAddressState);
export const relAddressCompany = childEntitySelector(selectCompanyState, 'addressId', 'company');
