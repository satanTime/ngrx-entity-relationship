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
export const selectAddressState = createFeatureSelector<fromAddress.State>('addresses');
export const selectCompanyState = createFeatureSelector<fromCompany.State>('companies');
export const selectUserState = createFeatureSelector<fromUser.State>('users');

// id selectors
export const selectCurrentCompanyId = createSelector(selectCompanyState, s => s.selectedId);
export const selectCurrentUsersIds = createSelector(selectUserState, s => s.selectedIds);

// creating selector producers for Address and its relationships
export const sAddress = rootEntitySelector(selectAddressState);
export const sAddressCompany = childEntitySelector(selectCompanyState, 'addressId', 'company');

// creating selector producers for Company and its relationships
export const sCompany = rootEntitySelector(selectCompanyState);
export const sCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address');
export const sCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
export const sCompanyStaff = childrenEntitiesSelector(selectUserState, 'companyId', 'staff');

// creating selector producers for User and its relationships
export const sUser = rootEntitySelector(selectUserState);
export const sUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
export const sUserEmployees = childrenEntitiesSelector(selectUserState, 'managerId', 'employees');
export const sUserManager = relatedEntitySelector(selectUserState, 'managerId', 'manager');
