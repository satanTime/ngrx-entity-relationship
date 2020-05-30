import {
    childEntity,
    childrenEntities,
    ENTITY_STATE,
    FEATURE_SELECTOR,
    relatedEntity,
    rootEntity,
} from 'ngrx-entity-relationship';

describe('reuse-of-nested-entities', () => {
    interface User {
        id: string;
        firstName: string;
        lastName: string;
        company?: Company;
        companyId?: string;
        employees?: Array<User>;
        employeesId?: Array<string>;
    }
    interface Company {
        id: string;
        name: string;
        staff?: Array<User>;
        admin?: User;
        adminId?: string;
        address?: Address;
    }
    interface Address {
        id: string;
        street: string;
        city: string;
        country: string;
        companyId?: string;
    }

    it('keeps unchanged entities the same', () => {
        const state: {users: ENTITY_STATE<User>; companies: ENTITY_STATE<Company>; addresses: ENTITY_STATE<Address>} = {
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

        const selectUserState: FEATURE_SELECTOR<typeof state, User> = v => v.users;
        const selectCompanyState: FEATURE_SELECTOR<typeof state, Company> = v => v.companies;
        const selectAddressState: FEATURE_SELECTOR<typeof state, Address> = v => v.addresses;

        state.users.entities = {
            ...state.users.entities,
            id1: {
                id: 'id1',
                firstName: 'firstName1',
                lastName: 'lastName1',
                companyId: 'id1',
                employeesId: ['id1', 'id2'],
            },
            id2: {
                id: 'id2',
                firstName: 'firstName2',
                lastName: 'lastName2',
                companyId: 'id1',
            },
        };
        state.companies.entities = {
            ...state.companies.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        state.addresses.entities = {
            ...state.addresses.entities,
            id1: {
                id: 'id1',
                street: 'street1',
                city: 'city1',
                country: 'country1',
                companyId: 'id1',
            },
        };

        const selector = rootEntity(
            selectUserState,
            relatedEntity(selectUserState, 'employeesId', 'employees'),
            relatedEntity(
                selectCompanyState,
                'companyId',
                'company',
                childrenEntities(selectUserState, 'companyId', 'staff'),
                childEntity(selectAddressState, 'companyId', 'address'),
            ),
        );

        // by default we assert that got what we expected.
        const actual1 = selector(state, 'id1');
        expect(actual1).toEqual({
            id: 'id1',
            firstName: 'firstName1',
            lastName: 'lastName1',
            companyId: 'id1',
            employeesId: ['id1', 'id2'],
            employees: [
                {
                    id: 'id1',
                    firstName: 'firstName1',
                    lastName: 'lastName1',
                    companyId: 'id1',
                    employeesId: ['id1', 'id2'],
                },
                {
                    id: 'id2',
                    firstName: 'firstName2',
                    lastName: 'lastName2',
                    companyId: 'id1',
                },
            ],
            company: {
                id: 'id1',
                name: 'name1',
                staff: [
                    {
                        id: 'id1',
                        firstName: 'firstName1',
                        lastName: 'lastName1',
                        companyId: 'id1',
                        employeesId: ['id1', 'id2'],
                    },
                    {
                        id: 'id2',
                        firstName: 'firstName2',
                        lastName: 'lastName2',
                        companyId: 'id1',
                    },
                ],
                address: {
                    id: 'id1',
                    street: 'street1',
                    city: 'city1',
                    country: 'country1',
                    companyId: 'id1',
                },
            },
        });

        // changing company, its staff and address should have the same pointers as before.
        // but company and the main user have to be changed.
        state.companies.entities = {
            ...state.companies.entities,
            id1: {
                ...state.companies.entities.id1,
                name: 'name1.1',
            },
        };

        let expected = actual1;
        const actual2 = selector(state, 'id1');
        expect(actual2).toEqual({
            id: 'id1',
            firstName: 'firstName1',
            lastName: 'lastName1',
            companyId: 'id1',
            employeesId: ['id1', 'id2'],
            employees: [
                {
                    id: 'id1',
                    firstName: 'firstName1',
                    lastName: 'lastName1',
                    companyId: 'id1',
                    employeesId: ['id1', 'id2'],
                },
                {
                    id: 'id2',
                    firstName: 'firstName2',
                    lastName: 'lastName2',
                    companyId: 'id1',
                },
            ],
            company: {
                id: 'id1',
                name: 'name1.1',
                staff: [
                    {
                        id: 'id1',
                        firstName: 'firstName1',
                        lastName: 'lastName1',
                        companyId: 'id1',
                        employeesId: ['id1', 'id2'],
                    },
                    {
                        id: 'id2',
                        firstName: 'firstName2',
                        lastName: 'lastName2',
                        companyId: 'id1',
                    },
                ],
                address: {
                    id: 'id1',
                    street: 'street1',
                    city: 'city1',
                    country: 'country1',
                    companyId: 'id1',
                },
            },
        });
        // all parent entities should have new pointers because of their changed child.
        expect(actual2).not.toBe(expected);
        // an unchanged relationship should have the same pointer.
        expect(actual2.employees).toBe(expected.employees);
        expect(actual2.employees[0]).toBe(expected.employees[0]);
        expect(actual2.employees[1]).toBe(expected.employees[1]);
        expect(actual2.employees[2]).toBeUndefined();
        // a changed relationship should have a new pointer.
        expect(actual2.company).not.toBe(expected.company);
        // an unchanged relationship should have the same pointer.
        expect(actual2.company.staff).toBe(expected.company.staff);
        expect(actual2.company.staff[0]).toBe(expected.company.staff[0]);
        expect(actual2.company.staff[1]).toBe(expected.company.staff[1]);
        expect(actual2.company.staff[2]).toBeUndefined();
        // an unchanged relationship should have the same pointer.
        expect(actual2.company.address).toBe(expected.company.address);

        // changing the 2nd user, main user, employees, company, staff should be changed.
        // but the 1st user and the address should stay the same.
        state.users.entities = {
            ...state.users.entities,
            id2: {
                ...state.users.entities.id2,
                firstName: 'firstName2.1',
            },
        };

        expected = actual2;
        const actual3 = selector(state, 'id1');
        expect(actual3).toEqual({
            id: 'id1',
            firstName: 'firstName1',
            lastName: 'lastName1',
            companyId: 'id1',
            employeesId: ['id1', 'id2'],
            employees: [
                {
                    id: 'id1',
                    firstName: 'firstName1',
                    lastName: 'lastName1',
                    companyId: 'id1',
                    employeesId: ['id1', 'id2'],
                },
                {
                    id: 'id2',
                    firstName: 'firstName2.1',
                    lastName: 'lastName2',
                    companyId: 'id1',
                },
            ],
            company: {
                id: 'id1',
                name: 'name1.1',
                staff: [
                    {
                        id: 'id1',
                        firstName: 'firstName1',
                        lastName: 'lastName1',
                        companyId: 'id1',
                        employeesId: ['id1', 'id2'],
                    },
                    {
                        id: 'id2',
                        firstName: 'firstName2.1',
                        lastName: 'lastName2',
                        companyId: 'id1',
                    },
                ],
                address: {
                    id: 'id1',
                    street: 'street1',
                    city: 'city1',
                    country: 'country1',
                    companyId: 'id1',
                },
            },
        });
        // all parent entities should have new pointers because of their changed child.
        expect(actual3).not.toBe(expected);
        expect(actual3.company).not.toBe(expected.company);
        // an employee has been changed, the array and the related entity has only to be changed.
        expect(actual3.employees).not.toBe(expected.employees);
        expect(actual3.employees[0]).toBe(expected.employees[0]);
        expect(actual3.employees[1]).not.toBe(expected.employees[1]);
        expect(actual3.employees[2]).toBeUndefined();
        expect(actual3.company.staff).not.toBe(expected.company.staff);
        expect(actual3.company.staff[0]).toBe(expected.company.staff[0]);
        expect(actual3.company.staff[1]).not.toBe(expected.company.staff[1]);
        expect(actual3.company.staff[2]).toBeUndefined();
        // an unchanged relationship should have the same pointer.
        expect(actual3.company.address).toBe(expected.company.address);

        // changing the address. only employees and staff should stay the same.
        state.addresses.entities = {
            ...state.addresses.entities,
            id1: {
                ...state.addresses.entities.id1,
                street: 'street1.1',
            },
        };

        expected = actual3;
        const actual4 = selector(state, 'id1');
        expect(actual4).toEqual({
            id: 'id1',
            firstName: 'firstName1',
            lastName: 'lastName1',
            companyId: 'id1',
            employeesId: ['id1', 'id2'],
            employees: [
                {
                    id: 'id1',
                    firstName: 'firstName1',
                    lastName: 'lastName1',
                    companyId: 'id1',
                    employeesId: ['id1', 'id2'],
                },
                {
                    id: 'id2',
                    firstName: 'firstName2.1',
                    lastName: 'lastName2',
                    companyId: 'id1',
                },
            ],
            company: {
                id: 'id1',
                name: 'name1.1',
                staff: [
                    {
                        id: 'id1',
                        firstName: 'firstName1',
                        lastName: 'lastName1',
                        companyId: 'id1',
                        employeesId: ['id1', 'id2'],
                    },
                    {
                        id: 'id2',
                        firstName: 'firstName2.1',
                        lastName: 'lastName2',
                        companyId: 'id1',
                    },
                ],
                address: {
                    id: 'id1',
                    street: 'street1.1',
                    city: 'city1',
                    country: 'country1',
                    companyId: 'id1',
                },
            },
        });
        // all parent entities should have new pointers because of their changed child.
        expect(actual4).not.toBe(expected);
        expect(actual4.company).not.toBe(expected.company);
        expect(actual4.company.address).not.toBe(expected.company.address);
        // users weren't touched.
        expect(actual4.employees).toBe(expected.employees);
        expect(actual4.employees[0]).toBe(expected.employees[0]);
        expect(actual4.employees[1]).toBe(expected.employees[1]);
        expect(actual4.employees[2]).toBeUndefined();
        expect(actual4.company.staff).toBe(expected.company.staff);
        expect(actual4.company.staff[0]).toBe(expected.company.staff[0]);
        expect(actual4.company.staff[1]).toBe(expected.company.staff[1]);
        expect(actual4.company.staff[2]).toBeUndefined();

        // changing the root user. only address and the 2nd user shouldn't be touched.
        state.users.entities = {
            ...state.users.entities,
            id1: {
                ...state.users.entities.id1,
                firstName: 'firstName1.1',
            },
        };

        expected = actual4;
        const actual5 = selector(state, 'id1');
        expect(actual5).toEqual({
            id: 'id1',
            firstName: 'firstName1.1',
            lastName: 'lastName1',
            companyId: 'id1',
            employeesId: ['id1', 'id2'],
            employees: [
                {
                    id: 'id1',
                    firstName: 'firstName1.1',
                    lastName: 'lastName1',
                    companyId: 'id1',
                    employeesId: ['id1', 'id2'],
                },
                {
                    id: 'id2',
                    firstName: 'firstName2.1',
                    lastName: 'lastName2',
                    companyId: 'id1',
                },
            ],
            company: {
                id: 'id1',
                name: 'name1.1',
                staff: [
                    {
                        id: 'id1',
                        firstName: 'firstName1.1',
                        lastName: 'lastName1',
                        companyId: 'id1',
                        employeesId: ['id1', 'id2'],
                    },
                    {
                        id: 'id2',
                        firstName: 'firstName2.1',
                        lastName: 'lastName2',
                        companyId: 'id1',
                    },
                ],
                address: {
                    id: 'id1',
                    street: 'street1.1',
                    city: 'city1',
                    country: 'country1',
                    companyId: 'id1',
                },
            },
        });
        expect(actual5).not.toBe(expected);
        expect(actual5.company).not.toBe(expected.company);
        expect(actual5.employees).not.toBe(expected.employees);
        expect(actual5.employees[0]).not.toBe(expected.employees[0]);
        expect(actual5.employees[1]).toBe(expected.employees[1]);
        expect(actual5.employees[2]).toBeUndefined();
        expect(actual5.company.staff).not.toBe(expected.company.staff);
        expect(actual5.company.staff[0]).not.toBe(expected.company.staff[0]);
        expect(actual5.company.staff[1]).toBe(expected.company.staff[1]);
        expect(actual5.company.staff[2]).toBeUndefined();
        expect(actual5.company.address).toBe(expected.company.address);
    });
});
