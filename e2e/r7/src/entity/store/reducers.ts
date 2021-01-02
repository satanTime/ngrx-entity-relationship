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
    address: AddressState;
    company: CompanyState;
    user: UserState;
};

export const rootReducer = combineReducers<RootState>({
    address: addressReducer,
    company: companyReducer,
    user: userReducer,
});

// the lib part
export const selectAddressState = stateKeys((state: RootState) => state.address, 'byIds', 'ids');
export const selectCompanyState = (state: RootState) => state.company;
export const selectUserState = (state: RootState) => state.user;

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
