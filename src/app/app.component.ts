import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {selectAddress, selectAddressAll, selectAddressEntities, selectAddressIds, selectAddressTotal} from 'src/app/store/address';
import {setAddress} from 'src/app/store/address/address.actions';
import {selectCompany, selectCompanyAll, selectCompanyEntities, selectCompanyIds, selectCompanyTotal} from 'src/app/store/company';
import {setCompany} from 'src/app/store/company/company.actions';
import {
  selectCompleteUsers,
  selectSimpleUser,
  selectUserAll,
  selectUserEntities,
  selectUserIds,
  selectUserTotal,
} from 'src/app/store/user';
import {setUser} from 'src/app/store/user/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'app';

  public data$: Observable<{
    user1: unknown,
    user2: unknown,
    users: unknown,
    userIds: unknown,
    userEntities: unknown,
    userAll: unknown,
    userTotal: unknown;

    company3: unknown,
    company4: unknown,
    companyIds: unknown,
    companyEntities: unknown,
    companyAll: unknown,
    companyTotal: unknown;

    address5: unknown,
    address6: unknown,
    addressIds: unknown,
    addressEntities: unknown,
    addressAll: unknown,
    addressTotal: unknown;
  }>;

  constructor(protected store: Store) {
  }

  public ngOnInit(): void {
    this.data$ = combineLatest([
      combineLatest([
        this.store.select(selectSimpleUser, '3'),
        this.store.select(selectSimpleUser, '5'),
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
      map(([
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
      })),
    );

    this.store.dispatch(setUser({
      user: {
        id: '1',
        name: 'User 1',
        companyId: '3',
      }
    }));
    this.store.dispatch(setUser({
      user: {
        id: '2',
        name: 'User 2',
        companyId: '3',
      }
    }));
    this.store.dispatch(setUser({
      user: {
        id: '3',
        name: 'User 3',
        companyId: '3',
      }
    }));
    this.store.dispatch(setUser({
      user: {
        id: '4',
        name: 'User 4',
        companyId: '4',
      }
    }));
    this.store.dispatch(setUser({
      user: {
        id: '5',
        name: 'User 5',
        companyId: '4',
      }
    }));
    this.store.dispatch(setUser({
      user: {
        id: '6',
        name: 'User 6',
        companyId: '4',
      }
    }));
    this.store.dispatch(setCompany({
      company: {
        id: '3',
        name: 'Company 3',
        staffId: ['1', '2', '3'],
        adminId: '2',
        addressId: '5',
      }
    }));
    this.store.dispatch(setCompany({
      company: {
        id: '4',
        name: 'Company 4',
        staffId: ['4', '5', '6'],
        adminId: '5',
        addressId: '6',
      }
    }));
    this.store.dispatch(setAddress({
      address: {
        id: '5',
        name: 'Address 5',
        companyId: '3',
      }
    }));
    this.store.dispatch(setAddress({
      address: {
        id: '6',
        name: 'Address 6',
        companyId: '4',
      }
    }));

    setInterval(() => {
      this.store.dispatch(setAddress({
        address: {
          id: '6',
          name: `Address ${new Date().getTime()}`,
          companyId: '4',
        }
      }));
    }, 500);
  }
}
