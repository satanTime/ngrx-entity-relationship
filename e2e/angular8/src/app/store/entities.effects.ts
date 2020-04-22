import {Injectable} from '@angular/core';
import {Actions, Effect, ofType, ROOT_EFFECTS_INIT} from '@ngrx/effects';
import {merge, of} from 'rxjs';
import {switchMapTo} from 'rxjs/operators';
import {UpsertAddress} from './address/address.actions';
import {UpsertCompany} from './company/company.actions';
import {UpsertUser} from './user/user.actions';

@Injectable()
export class EntitiesEffects {
    @Effect()
    public readonly data$ = this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        switchMapTo(
            merge(
                of(
                    new UpsertAddress({
                        address: {
                            id: 'address1',
                            name: 'Address 1',
                        },
                    }),
                    new UpsertAddress({
                        address: {
                            id: 'address2',
                            name: 'Address 2',
                        },
                    }),
                ),
                of(
                    new UpsertCompany({
                        company: {
                            id: 'company1',
                            name: 'Company 1',
                            adminId: 'user1',
                            addressId: 'address1',
                        },
                    }),
                    new UpsertCompany({
                        company: {
                            id: 'company2',
                            name: 'Company 2',
                            adminId: 'user3',
                            addressId: 'address1',
                        },
                    }),
                    new UpsertCompany({
                        company: {
                            id: 'company3',
                            name: 'Company 3',
                            adminId: 'user5',
                            addressId: 'address2',
                        },
                    }),
                ),
                of(
                    new UpsertUser({
                        user: {
                            id: 'user1',
                            name: 'User 1',
                            companyId: 'company1',
                        },
                    }),
                    new UpsertUser({
                        user: {
                            id: 'user2',
                            name: 'User 2',
                            companyId: 'company1',
                            managerId: 'user1',
                        },
                    }),
                    new UpsertUser({
                        user: {
                            id: 'user3',
                            name: 'User 3',
                            companyId: 'company2',
                        },
                    }),
                    new UpsertUser({
                        user: {
                            id: 'user4',
                            name: 'User 4',
                            companyId: 'company2',
                            managerId: 'user3',
                        },
                    }),
                    new UpsertUser({
                        user: {
                            id: 'user5',
                            name: 'User 5',
                            companyId: 'company3',
                        },
                    }),
                    new UpsertUser({
                        user: {
                            id: 'user6',
                            name: 'User 6',
                            companyId: 'company3',
                            managerId: 'user5',
                        },
                    }),
                ),
            ),
        ),
    );

    constructor(protected readonly actions$: Actions) {}
}
