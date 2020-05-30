import {
    childEntity,
    childrenEntities,
    ENTITY_STATE,
    relatedEntity,
    rootEntities,
    rootEntity,
} from 'ngrx-entity-relationship';

describe('all-arguments-options-standard', () => {
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

    // creating selector
    const sUserSelector = rootEntity(
        selectUsersState,
        relatedEntity(
            selectCompaniesState,
            'companyId',
            'company',
            childrenEntities(selectUsersState, 'companyId', 'staff'),
            relatedEntity(selectUsersState, 'adminId', 'admin'),
            relatedEntity(
                selectAddressesState,
                'addressId',
                'address',
                childEntity(selectCompaniesState, 'addressId', 'company'),
            ),
        ),
        relatedEntity(
            selectUsersState,
            'managerId',
            'manager',
            relatedEntity(selectCompaniesState, 'companyId', 'company'),
            relatedEntity(selectUsersState, 'managerId', 'manager'),
            childrenEntities(selectUsersState, 'managerId', 'employees'),
        ),
        childrenEntities(
            selectUsersState,
            'managerId',
            'employees',
            relatedEntity(selectCompaniesState, 'companyId', 'company'),
            relatedEntity(selectUsersState, 'managerId', 'manager'),
            childrenEntities(selectUsersState, 'managerId', 'employees'),
        ),
    );
    const sUserSelectors = rootEntities(sUserSelector);
    const sCompanySelector = rootEntity(
        selectCompaniesState,
        childrenEntities(
            selectUsersState,
            'companyId',
            'staff',
            {
                flatKey: 'users',
            },
            relatedEntity(selectCompaniesState, 'companyId', 'company'),
            relatedEntity(selectUsersState, 'managerId', 'manager'),
            childrenEntities(selectUsersState, 'managerId', 'employees'),
        ),
        relatedEntity(
            selectUsersState,
            'adminId',
            'admin',
            relatedEntity(selectCompaniesState, 'companyId', 'company', {
                flatKey: 'companies',
            }),
            relatedEntity(selectUsersState, 'managerId', 'manager', {
                flatKey: 'users',
            }),
            childrenEntities(selectUsersState, 'managerId', 'employees', {
                flatKey: 'users',
            }),
        ),
        relatedEntity(
            selectAddressesState,
            'addressId',
            'address',
            {
                flatKey: 'addresses',
            },
            childEntity(selectCompaniesState, 'addressId', 'company', {
                flatKey: 'companies',
            }),
        ),
    );
    const sCompanySelectors = rootEntities(sCompanySelector);
    const sAddressSelector = rootEntity(
        selectAddressesState,
        {
            flatKey: 'addresses',
        },
        childEntity(
            selectCompaniesState,
            'addressId',
            'company',
            {
                flatKey: 'companies',
            },
            childrenEntities(selectUsersState, 'companyId', 'staff', {
                flatKey: 'users',
            }),
            relatedEntity(selectUsersState, 'adminId', 'admin', {
                flatKey: 'users',
            }),
            relatedEntity(selectAddressesState, 'addressId', 'address', {
                flatKey: 'addresses',
            }),
        ),
    );
    const sAddressSelectors = rootEntities(sAddressSelector);

    // creating selector with transformers
    const sUserSelectorTr = rootEntity(
        selectUsersState,
        e => ({...e, tr: true}),
        relatedEntity(
            selectCompaniesState,
            'companyId',
            'company',
            childrenEntities(selectUsersState, 'companyId', 'staff'),
            relatedEntity(selectUsersState, 'adminId', 'admin'),
            relatedEntity(selectAddressesState, 'addressId', 'address'),
        ),
        relatedEntity(
            selectUsersState,
            'managerId',
            'manager',
            relatedEntity(selectCompaniesState, 'companyId', 'company'),
            relatedEntity(selectUsersState, 'managerId', 'manager'),
            childrenEntities(selectUsersState, 'managerId', 'employees'),
        ),
        childrenEntities(
            selectUsersState,
            'managerId',
            'employees',
            relatedEntity(selectCompaniesState, 'companyId', 'company'),
            relatedEntity(selectUsersState, 'managerId', 'manager'),
            childrenEntities(selectUsersState, 'managerId', 'employees'),
        ),
    );
    const sUserSelectorsTr = rootEntities(sUserSelectorTr);
    const sCompanySelectorTr = rootEntity(
        selectCompaniesState,
        e => ({...e, tr: true}),
        childrenEntities(
            selectUsersState,
            'companyId',
            'staff',
            {
                flatKey: 'users',
            },
            relatedEntity(selectCompaniesState, 'companyId', 'company'),
            relatedEntity(selectUsersState, 'managerId', 'manager'),
            childrenEntities(selectUsersState, 'managerId', 'employees'),
        ),
        relatedEntity(
            selectUsersState,
            'adminId',
            'admin',
            relatedEntity(selectCompaniesState, 'companyId', 'company', {
                flatKey: 'companies',
            }),
            relatedEntity(selectUsersState, 'managerId', 'manager', {
                flatKey: 'users',
            }),
            childrenEntities(selectUsersState, 'managerId', 'employees', {
                flatKey: 'users',
            }),
        ),
        relatedEntity(
            selectAddressesState,
            'addressId',
            'address',
            {
                flatKey: 'addresses',
            },
            childEntity(selectCompaniesState, 'addressId', 'company', {
                flatKey: 'companies',
            }),
        ),
    );
    const sCompanySelectorsTr = rootEntities(sCompanySelectorTr);
    const sAddressSelectorTr = rootEntity(
        selectAddressesState,
        e => ({...e, tr: true}),
        {
            flatKey: 'addresses',
        },
        childEntity(
            selectCompaniesState,
            'addressId',
            'company',
            {
                flatKey: 'companies',
            },
            childrenEntities(selectUsersState, 'companyId', 'staff', {
                flatKey: 'users',
            }),
            relatedEntity(selectUsersState, 'adminId', 'admin', {
                flatKey: 'users',
            }),
            relatedEntity(selectAddressesState, 'addressId', 'address', {
                flatKey: 'addresses',
            }),
        ),
    );
    const sAddressSelectorsTr = rootEntities(sAddressSelectorTr);

    // creating selector with meta
    const sUserSelectorMt = rootEntity(
        selectUsersState,
        {flatKey: 'users'},
        relatedEntity(
            selectCompaniesState,
            'companyId',
            'company',
            {flatKey: 'companies'},
            childrenEntities(selectUsersState, 'companyId', 'staff', {flatKey: 'users'}),
            relatedEntity(selectUsersState, 'adminId', 'admin', {flatKey: 'users'}),
            relatedEntity(selectAddressesState, 'addressId', 'address', {flatKey: 'addresses'}),
        ),
        relatedEntity(
            selectUsersState,
            'managerId',
            'manager',
            {flatKey: 'users'},
            relatedEntity(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'}),
            relatedEntity(selectUsersState, 'managerId', 'manager', {flatKey: 'users'}),
            childrenEntities(selectUsersState, 'managerId', 'employees', {flatKey: 'users'}),
        ),
        childrenEntities(
            selectUsersState,
            'managerId',
            'employees',
            {flatKey: 'users'},
            relatedEntity(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'}),
            relatedEntity(selectUsersState, 'managerId', 'manager', {flatKey: 'users'}),
            childrenEntities(selectUsersState, 'managerId', 'employees', {flatKey: 'users'}),
        ),
    );
    const sUserSelectorsMt = rootEntities(sUserSelectorMt);
    const sCompanySelectorMt = rootEntity(
        selectCompaniesState,
        {flatKey: 'companies'},
        childrenEntities(
            selectUsersState,
            'companyId',
            'staff',
            {flatKey: 'users'},
            relatedEntity(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'}),
            relatedEntity(selectUsersState, 'managerId', 'manager', {flatKey: 'users'}),
            childrenEntities(selectUsersState, 'managerId', 'employees', {flatKey: 'users'}),
        ),
        relatedEntity(
            selectUsersState,
            'adminId',
            'admin',
            {flatKey: 'users'},
            relatedEntity(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'}),
            relatedEntity(selectUsersState, 'managerId', 'manager', {flatKey: 'users'}),
            childrenEntities(selectUsersState, 'managerId', 'employees', {flatKey: 'users'}),
        ),
        relatedEntity(
            selectAddressesState,
            'addressId',
            'address',
            {flatKey: 'addresses'},
            childEntity(selectCompaniesState, 'addressId', 'company', {flatKey: 'companies'}),
        ),
    );
    const sCompanySelectorsMt = rootEntities(sCompanySelectorMt);
    const sAddressSelectorMt = rootEntity(
        selectAddressesState,
        {flatKey: 'addresses'},
        childEntity(
            selectCompaniesState,
            'addressId',
            'company',
            {flatKey: 'companies'},
            childrenEntities(selectUsersState, 'companyId', 'staff', {flatKey: 'users'}),
            relatedEntity(selectUsersState, 'adminId', 'admin', {flatKey: 'users'}),
            relatedEntity(selectAddressesState, 'addressId', 'address', {flatKey: 'addresses'}),
        ),
    );
    const sAddressSelectorsMt = rootEntities(sAddressSelectorMt);

    // creating selector with transformers and meta
    const sUserSelectorTrMt = rootEntity(
        selectUsersState,
        e => ({...e, tr: true}),
        {flatKey: 'users'},
        relatedEntity(
            selectCompaniesState,
            'companyId',
            'company',
            {flatKey: 'companies'},
            childrenEntities(selectUsersState, 'companyId', 'staff', {flatKey: 'users'}),
            relatedEntity(selectUsersState, 'adminId', 'admin', {flatKey: 'users'}),
            relatedEntity(selectAddressesState, 'addressId', 'address', {flatKey: 'addresses'}),
        ),
        relatedEntity(
            selectUsersState,
            'managerId',
            'manager',
            {flatKey: 'users'},
            relatedEntity(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'}),
            relatedEntity(selectUsersState, 'managerId', 'manager', {flatKey: 'users'}),
            childrenEntities(selectUsersState, 'managerId', 'employees', {flatKey: 'users'}),
        ),
        childrenEntities(
            selectUsersState,
            'managerId',
            'employees',
            {flatKey: 'users'},
            relatedEntity(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'}),
            relatedEntity(selectUsersState, 'managerId', 'manager', {flatKey: 'users'}),
            childrenEntities(selectUsersState, 'managerId', 'employees', {flatKey: 'users'}),
        ),
    );
    const sUserSelectorsTrMt = rootEntities(sUserSelectorTrMt);
    const sCompanySelectorTrMt = rootEntity(
        selectCompaniesState,
        e => ({...e, tr: true}),
        {flatKey: 'companies'},
        childrenEntities(
            selectUsersState,
            'companyId',
            'staff',
            {flatKey: 'users'},
            relatedEntity(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'}),
            relatedEntity(selectUsersState, 'managerId', 'manager', {flatKey: 'users'}),
            childrenEntities(selectUsersState, 'managerId', 'employees', {flatKey: 'users'}),
        ),
        relatedEntity(
            selectUsersState,
            'adminId',
            'admin',
            {flatKey: 'users'},
            relatedEntity(selectCompaniesState, 'companyId', 'company', {flatKey: 'companies'}),
            relatedEntity(selectUsersState, 'managerId', 'manager', {flatKey: 'users'}),
            childrenEntities(selectUsersState, 'managerId', 'employees', {flatKey: 'users'}),
        ),
        relatedEntity(
            selectAddressesState,
            'addressId',
            'address',
            {flatKey: 'addresses'},
            childEntity(selectCompaniesState, 'addressId', 'company', {flatKey: 'companies'}),
        ),
    );
    const sCompanySelectorsTrMt = rootEntities(sCompanySelectorTrMt);
    const sAddressSelectorTrMt = rootEntity(
        selectAddressesState,
        e => ({...e, tr: true}),
        {flatKey: 'addresses'},
        childEntity(
            selectCompaniesState,
            'addressId',
            'company',
            {flatKey: 'companies'},
            childrenEntities(selectUsersState, 'companyId', 'staff', {flatKey: 'users'}),
            relatedEntity(selectUsersState, 'adminId', 'admin', {flatKey: 'users'}),
            relatedEntity(selectAddressesState, 'addressId', 'address', {flatKey: 'addresses'}),
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
