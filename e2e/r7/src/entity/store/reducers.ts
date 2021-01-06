import {createSelector} from '@reduxjs/toolkit';
import {
    childEntitySelector,
    childrenEntitiesSelector,
    relatedEntitySelector,
    rootEntitySelector,
    stateKeys,
} from 'ngrx-entity-relationship';
import {combineReducers} from 'redux';

import {addressReducer, AddressState} from './address/address.reducer';
import {companyReducer, CompanyState} from './company/company.reducer';
import {userReducer, UserState} from './user/user.reducer';

export type RootState = {
    users: UserState;
    companies: CompanyState;
    addresses: AddressState;
};

export const rootReducer = combineReducers<RootState>({
    users: userReducer,
    companies: companyReducer,
    addresses: addressReducer,
});

// the lib part
export const selectUserState = (state: RootState) => state.users;
export const selectCompanyState = (state: RootState) => state.companies;
export const selectAddressState = stateKeys((state: RootState) => state.addresses, 'byIds', 'existingIds');

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
