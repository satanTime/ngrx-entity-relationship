import {render, screen} from '@testing-library/react';
import React from 'react';

import App from './App';

beforeEach(() => {
    render(<App />);
    screen.getByRole('EntityClassMapTo').click();
});

test('renders initial state', () => {
    const companySource = screen.getByRole('companies').innerHTML;
    const company = JSON.parse(companySource);
    expect(company).toEqual({
        id: 'company3',
        name: 'Company 3',
        adminId: 'user5',
        addressId: 'address2',
        address: {
            id: 'address2',
            name: 'Address 2',
        },
        admin: {
            id: 'user5',
            name: 'User 5',
            companyId: 'company3',
            employees: [
                {
                    id: 'user6',
                    name: 'User 6',
                    companyId: 'company3',
                    managerId: 'user5',
                },
            ],
        },
        staff: [
            {
                id: 'user5',
                name: 'User 5',
                companyId: 'company3',
                company: {
                    id: 'company3',
                    name: 'Company 3',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Address 2',
                        company: {
                            id: 'company3',
                            name: 'Company 3',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
            {
                id: 'user6',
                name: 'User 6',
                companyId: 'company3',
                managerId: 'user5',
                company: {
                    id: 'company3',
                    name: 'Company 3',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Address 2',
                        company: {
                            id: 'company3',
                            name: 'Company 3',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
        ],
    });

    const usersSource = screen.getByRole('users').innerHTML;
    const users = JSON.parse(usersSource);
    expect(users).toEqual([
        {
            id: 'user1',
            name: 'User 1',
            companyId: 'company1',
            employees: [
                {
                    id: 'user2',
                    name: 'User 2',
                    companyId: 'company1',
                    managerId: 'user1',
                    manager: {
                        id: 'user1',
                        name: 'User 1',
                        companyId: 'company1',
                    },
                },
            ],
        },
        {
            id: 'user3',
            name: 'User 3',
            companyId: 'company2',
            employees: [
                {
                    id: 'user4',
                    name: 'User 4',
                    companyId: 'company2',
                    managerId: 'user3',
                    manager: {
                        id: 'user3',
                        name: 'User 3',
                        companyId: 'company2',
                    },
                },
            ],
        },
        {
            id: 'user6',
            name: 'User 6',
            companyId: 'company3',
            managerId: 'user5',
            employees: [],
            manager: {
                id: 'user5',
                name: 'User 5',
                companyId: 'company3',
            },
        },
    ]);
});

test('updates a company', async () => {
    screen.getByRole('company3').click();

    const companySource = screen.getByRole('companies').innerHTML;
    const company = JSON.parse(companySource);
    expect(company).toEqual({
        id: 'company3',
        name: 'Changed Company 4',
        adminId: 'user5',
        addressId: 'address2',
        address: {
            id: 'address2',
            name: 'Address 2',
        },
        admin: {
            id: 'user5',
            name: 'User 5',
            companyId: 'company3',
            employees: [
                {
                    id: 'user6',
                    name: 'User 6',
                    companyId: 'company3',
                    managerId: 'user5',
                },
            ],
        },
        staff: [
            {
                id: 'user5',
                name: 'User 5',
                companyId: 'company3',
                company: {
                    id: 'company3',
                    name: 'Changed Company 4',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Address 2',
                        company: {
                            id: 'company3',
                            name: 'Changed Company 4',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
            {
                id: 'user6',
                name: 'User 6',
                companyId: 'company3',
                managerId: 'user5',
                company: {
                    id: 'company3',
                    name: 'Changed Company 4',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Address 2',
                        company: {
                            id: 'company3',
                            name: 'Changed Company 4',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
        ],
    });
});

test('updates an address', async () => {
    screen.getByRole('address2').click();

    const companySource = screen.getByRole('companies').innerHTML;
    const company = JSON.parse(companySource);
    expect(company).toEqual({
        id: 'company3',
        name: 'Changed Company 4',
        adminId: 'user5',
        addressId: 'address2',
        address: {
            id: 'address2',
            name: 'Changed Address 3',
        },
        admin: {
            id: 'user5',
            name: 'User 5',
            companyId: 'company3',
            employees: [
                {
                    id: 'user6',
                    name: 'User 6',
                    companyId: 'company3',
                    managerId: 'user5',
                },
            ],
        },
        staff: [
            {
                id: 'user5',
                name: 'User 5',
                companyId: 'company3',
                company: {
                    id: 'company3',
                    name: 'Changed Company 4',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Changed Address 3',
                        company: {
                            id: 'company3',
                            name: 'Changed Company 4',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
            {
                id: 'user6',
                name: 'User 6',
                companyId: 'company3',
                managerId: 'user5',
                company: {
                    id: 'company3',
                    name: 'Changed Company 4',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Changed Address 3',
                        company: {
                            id: 'company3',
                            name: 'Changed Company 4',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
        ],
    });
});

it('updates a user', async () => {
    screen.getByRole('user5').click();

    const companySource = screen.getByRole('companies').innerHTML;
    const company = JSON.parse(companySource);
    expect(company).toEqual({
        id: 'company3',
        name: 'Changed Company 4',
        adminId: 'user5',
        addressId: 'address2',
        address: {
            id: 'address2',
            name: 'Changed Address 3',
        },
        admin: {
            id: 'user5',
            name: 'Changed User 6',
            companyId: 'company3',
            employees: [
                {
                    id: 'user6',
                    name: 'User 6',
                    companyId: 'company3',
                    managerId: 'user5',
                },
            ],
        },
        staff: [
            {
                id: 'user5',
                name: 'Changed User 6',
                companyId: 'company3',
                company: {
                    id: 'company3',
                    name: 'Changed Company 4',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Changed Address 3',
                        company: {
                            id: 'company3',
                            name: 'Changed Company 4',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
            {
                id: 'user6',
                name: 'User 6',
                companyId: 'company3',
                managerId: 'user5',
                company: {
                    id: 'company3',
                    name: 'Changed Company 4',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Changed Address 3',
                        company: {
                            id: 'company3',
                            name: 'Changed Company 4',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
        ],
    });

    const usersSource = screen.getByRole('users').innerHTML;
    const users = JSON.parse(usersSource);
    expect(users).toEqual([
        {
            id: 'user1',
            name: 'User 1',
            companyId: 'company1',
            employees: [
                {
                    id: 'user2',
                    name: 'User 2',
                    companyId: 'company1',
                    managerId: 'user1',
                    manager: {
                        id: 'user1',
                        name: 'User 1',
                        companyId: 'company1',
                    },
                },
            ],
        },
        {
            id: 'user3',
            name: 'User 3',
            companyId: 'company2',
            employees: [
                {
                    id: 'user4',
                    name: 'User 4',
                    companyId: 'company2',
                    managerId: 'user3',
                    manager: {
                        id: 'user3',
                        name: 'User 3',
                        companyId: 'company2',
                    },
                },
            ],
        },
        {
            id: 'user6',
            name: 'User 6',
            companyId: 'company3',
            managerId: 'user5',
            employees: [],
            manager: {
                id: 'user5',
                name: 'Changed User 6',
                companyId: 'company3',
            },
        },
    ]);
});

test('updates an another user', async () => {
    screen.getByRole('user6').click();

    const companySource = screen.getByRole('companies').innerHTML;
    const company = JSON.parse(companySource);
    expect(company).toEqual({
        id: 'company3',
        name: 'Changed Company 4',
        adminId: 'user5',
        addressId: 'address2',
        address: {
            id: 'address2',
            name: 'Changed Address 3',
        },
        admin: {
            id: 'user5',
            name: 'Changed User 6',
            companyId: 'company3',
            employees: [
                {
                    id: 'user6',
                    name: 'Changed User 7',
                    companyId: 'company3',
                    managerId: 'user5',
                },
            ],
        },
        staff: [
            {
                id: 'user5',
                name: 'Changed User 6',
                companyId: 'company3',
                company: {
                    id: 'company3',
                    name: 'Changed Company 4',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Changed Address 3',
                        company: {
                            id: 'company3',
                            name: 'Changed Company 4',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
            {
                id: 'user6',
                name: 'Changed User 7',
                companyId: 'company3',
                managerId: 'user5',
                company: {
                    id: 'company3',
                    name: 'Changed Company 4',
                    adminId: 'user5',
                    addressId: 'address2',
                    address: {
                        id: 'address2',
                        name: 'Changed Address 3',
                        company: {
                            id: 'company3',
                            name: 'Changed Company 4',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    },
                },
            },
        ],
    });

    const usersSource = screen.getByRole('users').innerHTML;
    const users = JSON.parse(usersSource);
    expect(users).toEqual([
        {
            id: 'user1',
            name: 'User 1',
            companyId: 'company1',
            employees: [
                {
                    id: 'user2',
                    name: 'User 2',
                    companyId: 'company1',
                    managerId: 'user1',
                    manager: {
                        id: 'user1',
                        name: 'User 1',
                        companyId: 'company1',
                    },
                },
            ],
        },
        {
            id: 'user3',
            name: 'User 3',
            companyId: 'company2',
            employees: [
                {
                    id: 'user4',
                    name: 'User 4',
                    companyId: 'company2',
                    managerId: 'user3',
                    manager: {
                        id: 'user3',
                        name: 'User 3',
                        companyId: 'company2',
                    },
                },
            ],
        },
        {
            id: 'user6',
            name: 'Changed User 7',
            companyId: 'company3',
            managerId: 'user5',
            employees: [],
            manager: {
                id: 'user5',
                name: 'Changed User 6',
                companyId: 'company3',
            },
        },
    ]);
});
