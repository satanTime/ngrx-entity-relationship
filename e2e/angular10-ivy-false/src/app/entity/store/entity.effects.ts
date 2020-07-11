import {Injectable} from '@angular/core';
import {Actions, Effect, ofType, ROOT_EFFECTS_INIT} from '@ngrx/effects';
import {reduceFlat, reduceGraph} from 'ngrx-entity-relationship';
import {switchMapTo} from 'rxjs/operators';
import {sAddress, sCompany, sUser} from './reducers';

@Injectable()
export class EntityEffects {
    @Effect()
    public readonly data$ = this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        switchMapTo([
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
                selector: sAddress(),
            }),
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
                selector: sCompany(),
            }),
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
                selector: sUser({
                    flatKey: 'users',
                }),
            }),
        ]),
    );

    constructor(protected readonly actions$: Actions) {}
}
