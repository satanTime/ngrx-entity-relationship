import {createFeatureSelector, createSelector} from '@ngrx/store';
import {
    childEntity,
    childrenEntities,
    childrenEntitiesSelector,
    relatedEntity,
    relatedEntitySelector,
    rootEntities,
    rootEntity,
    rootEntitySelector,
} from 'ngrx-entity-relationship';

import {selectAddressState} from '../address';
import {selectCompanyState} from '../company';
import {adapter} from './user.reducer';
import * as fromUser from './user.reducer';

export const selectUserState = createFeatureSelector<fromUser.State>('users');

export const selectUser = createSelector(selectUserState, (state, userId: string) => {
    return state.entities[userId];
});
export const selectUserIds = createSelector(
    selectUserState,
    fromUser.selectUserIds, // shorthand for usersState => fromUser.selectUserIds(usersState)
);
export const selectUserEntities = createSelector(selectUserState, fromUser.selectUserEntities);
export const selectUserAll = createSelector(selectUserState, fromUser.selectAllUsers);
export const selectUserTotal = createSelector(selectUserState, fromUser.selectUserTotal);

const transformedUser = rootEntitySelector({collection: selectUserState, id: adapter.selectId}, entity => ({
    ...entity,
    cloned: true,
}));
const transformedUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
const transformedCompany = rootEntitySelector(selectCompanyState, entity => ({...entity, cloned: true}));
const transformedCompanyStaff = childrenEntitiesSelector(selectUserState, 'companyId', 'staff');
const transformedCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
const transformedCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address');
const transformedAddress = rootEntitySelector(selectAddressState, entity => ({...entity, cloned: true}));
const transformedAddressCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
const entityUser = rootEntitySelector(selectUserState);
const entityUserCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');
const entityCompany = rootEntitySelector(selectCompanyState);
const entityCompanyStaff = childrenEntitiesSelector(selectUserState, 'companyId', 'staff');
const entityCompanyAdmin = relatedEntitySelector(selectUserState, 'adminId', 'admin');
const entityCompanyAddress = relatedEntitySelector(selectAddressState, 'addressId', 'address');
const entityAddress = rootEntitySelector(selectAddressState);
const entityAddressCompany = relatedEntitySelector(selectCompanyState, 'companyId', 'company');

export const selectCompleteUser = rootEntity(
    selectUserState,
    relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
        childrenEntities(selectUserState, 'companyId', 'staff'),
        relatedEntity(selectUserState, 'adminId', 'admin'),
        relatedEntity(
            selectAddressState,
            'addressId',
            'address',
            relatedEntity(selectCompanyState, 'companyId', 'company'),
        ),
    ),
    childrenEntities(selectUserState, 'managerId', 'employees'),
    childEntity(selectUserState, 'managerId', 'employee'),
);

export const selectTransformedUser = rootEntity(
    selectUserState,
    entity => ({...entity, cloned: true}),
    relatedEntity(
        selectCompanyState,
        'companyId',
        'company',
        childrenEntities(selectUserState, 'companyId', 'staff'),
        relatedEntity(selectUserState, 'adminId', 'admin'),
        relatedEntity(
            selectAddressState,
            'addressId',
            'address',
            relatedEntity(selectCompanyState, 'companyId', 'company'),
        ),
    ),
    childrenEntities(selectUserState, 'managerId', 'employees'),
    childEntity(selectUserState, 'managerId', 'employee'),
);

export const selectCompleteUsers = rootEntities(selectTransformedUser);

export const selectSimpleUser = entityUser(
    entityUserCompany(
        entityCompanyStaff(),
        entityCompanyAdmin(),
        entityCompanyAddress(entityAddressCompany(entityCompanyAdmin())),
    ),
);

export const selectSimpleTransformedUser = transformedUser(
    transformedUserCompany(
        transformedCompanyStaff(),
        transformedCompanyAdmin(),
        transformedCompanyAddress(transformedAddressCompany(transformedCompanyAdmin())),
    ),
);
