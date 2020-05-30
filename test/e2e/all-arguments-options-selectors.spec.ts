import {
    childEntitySelector,
    childrenEntitiesSelector,
    ENTITY_STATE,
    relatedEntitySelector,
    rootEntities,
    rootEntitySelector,
} from 'ngrx-entity-relationship';

describe('all-arguments-options-selectors', () => {
    interface User {
        id: string;
        user: string;
        companyId?: string;
        company?: Company;
        managerId?: string;
        manager: User;
        employees?: Array<User>;
    }
    interface Company {
        id: string;
        company: string;
        staff?: Array<User>;
        adminId?: string;
        admin?: User;
        addressId?: string;
        address?: Address;
    }
    interface Address {
        id: string;
        address: string;
        company?: Company;
    }

    const state: {
        users: ENTITY_STATE<User>;
        companies: ENTITY_STATE<Company>;
        addresses: ENTITY_STATE<Address>;
    } = {
        users: {
            ids: [],
            entities: {},
        },
        companies: {
            ids: [],
            entities: {},
        },
        addresses: {
            ids: [],
            entities: {},
        },
    };

    const selectUsersState = (s: typeof state) => s.users;
    const selectCompaniesState = (s: typeof state) => s.companies;
    const selectAddressesState = (s: typeof state) => s.addresses;

    // selectors
    const sUser = rootEntitySelector(selectUsersState);
    const sUserCompany = relatedEntitySelector(selectCompaniesState, 'companyId', 'company');
    const sUserManager = relatedEntitySelector(selectUsersState, 'managerId', 'manager');
    const sUserEmployees = childrenEntitiesSelector(selectUsersState, 'managerId', 'employees');
    const sCompany = rootEntitySelector(selectCompaniesState);
    const sCompanyStaff = childrenEntitiesSelector(selectUsersState, 'companyId', 'staff');
    const sCompanyAdmin = relatedEntitySelector(selectUsersState, 'adminId', 'admin');
    const sCompanyAddress = relatedEntitySelector(selectAddressesState, 'addressId', 'address');
    const sAddress = rootEntitySelector(selectAddressesState);
    const sAddressCompany = childEntitySelector(selectCompaniesState, 'addressId', 'company');

    // selectors with transformers
    const sUserTr = rootEntitySelector(selectUsersState, e => ({...e, tr: true}));
    const sCompanyTr = rootEntitySelector(selectCompaniesState, e => ({...e, tr: true}));
    const sAddressTr = rootEntitySelector(selectAddressesState, e => ({...e, tr: true}));

    // selectors with meta
    const sUserMt = rootEntitySelector(selectUsersState, {flatKey: 'users'});
    const sUserCompanyMt = relatedEntitySelector(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'});
    const sUserManagerMt = relatedEntitySelector(selectUsersState, 'managerId', 'manager', {flatKey: 'users'});
    const sUserEmployeesMt = childrenEntitiesSelector(selectUsersState, 'managerId', 'employees', {flatKey: 'users'});
    const sCompanyMt = rootEntitySelector(selectCompaniesState, {flatKey: 'companies'});
    const sCompanyStaffMt = childrenEntitiesSelector(selectUsersState, 'companyId', 'staff', {flatKey: 'users'});
    const sCompanyAdminMt = relatedEntitySelector(selectUsersState, 'adminId', 'admin', {flatKey: 'users'});
    const sCompanyAddressMt = relatedEntitySelector(selectAddressesState, 'addressId', 'address', {
        flatKey: 'addresses',
    });
    const sAddressMt = rootEntitySelector(selectAddressesState, {flatKey: 'addresses'});
    const sAddressCompanyMt = childEntitySelector(selectCompaniesState, 'addressId', 'company', {flatKey: 'companies'});

    // selectors with transformers and meta
    const sUserTrMt = rootEntitySelector(selectUsersState, e => ({...e, tr: true}), {flatKey: 'users'});
    const sCompanyTrMt = rootEntitySelector(selectCompaniesState, e => ({...e, tr: true}), {flatKey: 'companies'});
    const sAddressTrMt = rootEntitySelector(selectAddressesState, e => ({...e, tr: true}), {flatKey: 'addresses'});

    // creating selector
    const sUserSelector = sUser(
        sUserCompany(sCompanyStaff(), sCompanyAdmin(), sCompanyAddress()),
        sUserManager(sUserCompany(), sUserManager(), sUserEmployees()),
        sUserEmployees(sUserCompany(), sUserManager(), sUserEmployees()),
    );
    const sUserSelectors = rootEntities(sUserSelector);
    const sCompanySelector = sCompany(
        sCompanyStaff(
            {
                flatKey: 'users',
            },
            sUserCompany(),
            sUserManager(),
            sUserEmployees(),
        ),
        sCompanyAdmin(
            sUserCompany({
                flatKey: 'companies',
            }),
            sUserManager({
                flatKey: 'users',
            }),
            sUserEmployees({
                flatKey: 'users',
            }),
        ),
        sCompanyAddress(
            {
                flatKey: 'addresses',
            },
            sAddressCompany({
                flatKey: 'companies',
            }),
        ),
    );
    const sCompanySelectors = rootEntities(sCompanySelector);
    const sAddressSelector = sAddress(
        {
            flatKey: 'addresses',
        },
        sAddressCompany(
            {
                flatKey: 'companies',
            },
            sCompanyStaff({
                flatKey: 'users',
            }),
            sCompanyAdmin({
                flatKey: 'users',
            }),
            sCompanyAddress({
                flatKey: 'addresses',
            }),
        ),
    );
    const sAddressSelectors = rootEntities(sAddressSelector);

    // creating selector with transformers
    const sUserSelectorTr = sUserTr(
        sUserCompany(sCompanyStaff(), sCompanyAdmin(), sCompanyAddress()),
        sUserManager(sUserCompany(), sUserManager(), sUserEmployees()),
        sUserEmployees(sUserCompany(), sUserManager(), sUserEmployees()),
    );
    const sUserSelectorsTr = rootEntities(sUserSelectorTr);
    const sCompanySelectorTr = sCompanyTr(
        sCompanyStaff(
            {
                flatKey: 'users',
            },
            sUserCompany(),
            sUserManager(),
            sUserEmployees(),
        ),
        sCompanyAdmin(
            sUserCompany({
                flatKey: 'companies',
            }),
            sUserManager({
                flatKey: 'users',
            }),
            sUserEmployees({
                flatKey: 'users',
            }),
        ),
        sCompanyAddress(
            {
                flatKey: 'addresses',
            },
            sAddressCompany({
                flatKey: 'companies',
            }),
        ),
    );
    const sCompanySelectorsTr = rootEntities(sCompanySelectorTr);
    const sAddressSelectorTr = sAddressTr(
        {
            flatKey: 'addresses',
        },
        sAddressCompany(
            {
                flatKey: 'companies',
            },
            sCompanyStaff({
                flatKey: 'users',
            }),
            sCompanyAdmin({
                flatKey: 'users',
            }),
            sCompanyAddress({
                flatKey: 'addresses',
            }),
        ),
    );
    const sAddressSelectorsTr = rootEntities(sAddressSelectorTr);

    // creating selector with meta
    const sUserSelectorMt = sUserMt(
        sUserCompanyMt(sCompanyStaffMt(), sCompanyAdminMt(), sCompanyAddressMt()),
        sUserManagerMt(sUserCompanyMt(), sUserManagerMt(), sUserEmployeesMt()),
        sUserEmployeesMt(sUserCompanyMt(), sUserManagerMt(), sUserEmployeesMt()),
    );
    const sUserSelectorsMt = rootEntities(sUserSelectorMt);
    const sCompanySelectorMt = sCompanyMt(
        sCompanyStaffMt(
            {
                flatKey: 'users',
            },
            sUserCompanyMt(),
            sUserManagerMt(),
            sUserEmployeesMt(),
        ),
        sCompanyAdminMt(
            sUserCompanyMt({
                flatKey: 'companies',
            }),
            sUserManagerMt({
                flatKey: 'users',
            }),
            sUserEmployeesMt({
                flatKey: 'users',
            }),
        ),
        sCompanyAddressMt(
            {
                flatKey: 'addresses',
            },
            sAddressCompanyMt({
                flatKey: 'companies',
            }),
        ),
    );
    const sCompanySelectorsMt = rootEntities(sCompanySelectorMt);
    const sAddressSelectorMt = sAddressMt(
        {
            flatKey: 'addresses',
        },
        sAddressCompanyMt(
            {
                flatKey: 'companies',
            },
            sCompanyStaffMt({
                flatKey: 'users',
            }),
            sCompanyAdminMt({
                flatKey: 'users',
            }),
            sCompanyAddressMt({
                flatKey: 'addresses',
            }),
        ),
    );
    const sAddressSelectorsMt = rootEntities(sAddressSelectorMt);

    // creating selector with transformers and meta
    const sUserSelectorTrMt = sUserTrMt(
        sUserCompanyMt(sCompanyStaffMt(), sCompanyAdminMt(), sCompanyAddressMt()),
        sUserManagerMt(sUserCompanyMt(), sUserManagerMt(), sUserEmployeesMt()),
        sUserEmployeesMt(sUserCompanyMt(), sUserManagerMt(), sUserEmployeesMt()),
    );
    const sUserSelectorsTrMt = rootEntities(sUserSelectorTrMt);
    const sCompanySelectorTrMt = sCompanyTrMt(
        sCompanyStaffMt(
            {
                flatKey: 'users',
            },
            sUserCompanyMt(),
            sUserManagerMt(),
            sUserEmployeesMt(),
        ),
        sCompanyAdminMt(
            sUserCompanyMt({
                flatKey: 'companies',
            }),
            sUserManagerMt({
                flatKey: 'users',
            }),
            sUserEmployeesMt({
                flatKey: 'users',
            }),
        ),
        sCompanyAddressMt(
            {
                flatKey: 'addresses',
            },
            sAddressCompanyMt({
                flatKey: 'companies',
            }),
        ),
    );
    const sCompanySelectorsTrMt = rootEntities(sCompanySelectorTrMt);
    const sAddressSelectorTrMt = sAddressTrMt(
        {
            flatKey: 'addresses',
        },
        sAddressCompanyMt(
            {
                flatKey: 'companies',
            },
            sCompanyStaffMt({
                flatKey: 'users',
            }),
            sCompanyAdminMt({
                flatKey: 'users',
            }),
            sCompanyAddressMt({
                flatKey: 'addresses',
            }),
        ),
    );
    const sAddressSelectorsTrMt = rootEntities(sAddressSelectorTrMt);

    it('compiles selectors without an issue', () => {
        expect(sUserSelectors(state, [])).toEqual([]);
        expect(sCompanySelectors(state, [])).toEqual([]);
        expect(sAddressSelectors(state, [])).toEqual([]);
        expect(sUserSelectorsTr(state, [])).toEqual([]);
        expect(sCompanySelectorsTr(state, [])).toEqual([]);
        expect(sAddressSelectorsTr(state, [])).toEqual([]);
        expect(sUserSelectorsMt(state, [])).toEqual([]);
        expect(sCompanySelectorsMt(state, [])).toEqual([]);
        expect(sAddressSelectorsMt(state, [])).toEqual([]);
        expect(sUserSelectorsTrMt(state, [])).toEqual([]);
        expect(sCompanySelectorsTrMt(state, [])).toEqual([]);
        expect(sAddressSelectorsTrMt(state, [])).toEqual([]);
    });
});
