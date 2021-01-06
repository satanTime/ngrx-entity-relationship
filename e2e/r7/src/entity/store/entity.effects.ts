import {reduceFlat, reduceGraph} from 'ngrx-entity-relationship';
import {Store} from 'redux';

import {RootState, rootAddress, rootCompany, rootUser} from './reducers';

export class EntityEffects {
    constructor(protected readonly store: Store<RootState>) {}

    public address(): void {
        this.store.dispatch(
            reduceGraph({
                data: [
                    {
                        id: 'address1',
                        name: 'Address 1',
                    },
                    {
                        id: 'address2',
                        name: 'Address 2',
                    },
                ],
                selector: rootAddress(),
            }),
        );
    }

    public company(): void {
        this.store.dispatch(
            reduceGraph({
                data: [
                    {
                        id: 'company1',
                        name: 'Company 1',
                        adminId: 'user1',
                        addressId: 'address1',
                    },
                    {
                        id: 'company2',
                        name: 'Company 2',
                        adminId: 'user3',
                        addressId: 'address1',
                    },
                    {
                        id: 'company3',
                        name: 'Company 3',
                        adminId: 'user5',
                        addressId: 'address2',
                    },
                ],
                selector: rootCompany(),
            }),
        );
    }

    public user(): void {
        this.store.dispatch(
            reduceFlat({
                data: {
                    users: [
                        {
                            id: 'user1',
                            name: 'User 1',
                            companyId: 'company1',
                        },
                        {
                            id: 'user2',
                            name: 'User 2',
                            companyId: 'company1',
                            managerId: 'user1',
                        },
                        {
                            id: 'user3',
                            name: 'User 3',
                            companyId: 'company2',
                        },
                        {
                            id: 'user4',
                            name: 'User 4',
                            companyId: 'company2',
                            managerId: 'user3',
                        },
                        {
                            id: 'user5',
                            name: 'User 5',
                            companyId: 'company3',
                        },
                        {
                            id: 'user6',
                            name: 'User 6',
                            companyId: 'company3',
                            managerId: 'user5',
                        },
                    ],
                },
                selector: rootUser({
                    flatKey: 'users',
                }),
            }),
        );
    }
}
