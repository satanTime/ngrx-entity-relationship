import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {rootEntityFlags} from 'ngrx-entity-relationship';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {
    selectAddress,
    selectAddressAll,
    selectAddressEntities,
    selectAddressIds,
    selectAddressTotal,
} from '../store/address';
import {
    selectCompany,
    selectCompanyAll,
    selectCompanyEntities,
    selectCompanyIds,
    selectCompanyTotal,
} from '../store/company';
import {
    selectCompleteUsers,
    selectSimpleTransformedUser,
    selectTransformedUser,
    selectUserAll,
    selectUserEntities,
    selectUserIds,
    selectUserTotal,
} from '../store/user';
import {UpsertAddress} from '../store/address/address.actions';
import {UpsertCompany} from '../store/company/company.actions';
import {UpsertUser} from '../store/user/user.actions';

@Component({
    selector: 'app-entity',
    templateUrl: './entity.component.html',
    styleUrls: ['./entity.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityComponent implements OnInit {
    public title = 'app';

    public data$: Observable<{
        user1: any;
        user2: any;
        users: any;
        userIds: any;
        userEntities: any;
        userAll: any;
        userTotal: any;

        company3: any;
        company4: any;
        companyIds: any;
        companyEntities: any;
        companyAll: any;
        companyTotal: any;

        address5: any;
        address6: any;
        addressIds: any;
        addressEntities: any;
        addressAll: any;
        addressTotal: any;
    }>;

    constructor(protected store: Store<any>) {}

    public ngOnInit(): void {
        this.data$ = combineLatest([
            combineLatest([
                this.store.select(selectTransformedUser, '3'),
                this.store.select(selectSimpleTransformedUser, '5'),
                this.store.select(selectCompleteUsers, ['2', '6']),
                this.store.select(selectUserIds),
                this.store.select(selectUserEntities),
                this.store.select(selectUserAll),
                this.store.select(selectUserTotal),
            ]),
            combineLatest([
                this.store.select(selectCompany, '3'),
                this.store.select(selectCompany, '4'),
                this.store.select(selectCompanyIds),
                this.store.select(selectCompanyEntities),
                this.store.select(selectCompanyAll),
                this.store.select(selectCompanyTotal),
            ]),
            combineLatest([
                this.store.select(selectAddress, '5'),
                this.store.select(selectAddress, '6'),
                this.store.select(selectAddressIds),
                this.store.select(selectAddressEntities),
                this.store.select(selectAddressAll),
                this.store.select(selectAddressTotal),
            ]),
        ]).pipe(
            map(
                ([
                    [user1, user2, users, userIds, userEntities, userAll, userTotal],
                    [company3, company4, companyIds, companyEntities, companyAll, companyTotal],
                    [address5, address6, addressIds, addressEntities, addressAll, addressTotal],
                ]) => ({
                    user1,
                    user2,
                    users,
                    userIds,
                    userEntities,
                    userAll,
                    userTotal,

                    company3,
                    company4,
                    companyIds,
                    companyEntities,
                    companyAll,
                    companyTotal,

                    address5,
                    address6,
                    addressIds,
                    addressEntities,
                    addressAll,
                    addressTotal,
                }),
            ),
        );

        this.store.dispatch(
            new UpsertUser({
                user: {
                    id: '1',
                    name: 'User 1',
                    managerId: '3',
                    companyId: '3',
                },
            }),
        );
        this.store.dispatch(
            new UpsertUser({
                user: {
                    id: '2',
                    name: 'User 2',
                    managerId: '3',
                    companyId: '3',
                },
            }),
        );
        this.store.dispatch(
            new UpsertUser({
                user: {
                    id: '3',
                    name: 'User 3',
                    companyId: '3',
                },
            }),
        );
        this.store.dispatch(
            new UpsertUser({
                user: {
                    id: '4',
                    name: 'User 4',
                    managerId: '3',
                    companyId: '4',
                },
            }),
        );
        this.store.dispatch(
            new UpsertUser({
                user: {
                    id: '5',
                    name: 'User 5',
                    companyId: '4',
                },
            }),
        );
        this.store.dispatch(
            new UpsertUser({
                user: {
                    id: '6',
                    name: 'User 6',
                    companyId: '4',
                },
            }),
        );
        this.store.dispatch(
            new UpsertCompany({
                company: {
                    id: '3',
                    name: 'Company 3',
                    adminId: '2',
                    addressId: '5',
                },
            }),
        );
        this.store.dispatch(
            new UpsertCompany({
                company: {
                    id: '4',
                    name: 'Company 4',
                    adminId: '5',
                    addressId: '6',
                },
            }),
        );
        this.store.dispatch(
            new UpsertAddress({
                address: {
                    id: '5',
                    name: 'Address 5',
                    companyId: '3',
                },
            }),
        );
        this.store.dispatch(
            new UpsertAddress({
                address: {
                    id: '6',
                    name: 'Address 6',
                    companyId: '4',
                },
            }),
        );

        rootEntityFlags.disabled = true;

        setTimeout(() => {
            rootEntityFlags.disabled = false;
        }, 1500);

        setInterval(() => {
            this.store.dispatch(
                new UpsertAddress({
                    address: {
                        id: '6',
                        name: `Address ${new Date().getTime()}`,
                        companyId: '4',
                    },
                }),
            );
        }, 500);
    }
}
