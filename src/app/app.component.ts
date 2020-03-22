import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {selectAddress, selectAddressAll, selectAddressEntities, selectAddressIds, selectAddressTotal} from 'src/app/store/address';
import {addAddress} from 'src/app/store/address/address.actions';
import {selectCompany, selectCompanyAll, selectCompanyEntities, selectCompanyIds, selectCompanyTotal} from 'src/app/store/company';
import {addCompany} from 'src/app/store/company/company.actions';
import {selectUser, selectUserAll, selectUserEntities, selectUserIds, selectUserTotal} from 'src/app/store/user';
import {addUser} from 'src/app/store/user/user.actions';

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
        this.store.select(selectUser, '1'),
        this.store.select(selectUser, '2'),
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
          [user1, user2, userIds, userEntities, userAll, userTotal],
          [company3, company4, companyIds, companyEntities, companyAll, companyTotal],
          [address5, address6, addressIds, addressEntities, addressAll, addressTotal],
        ]) => ({
        user1,
        user2,
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

    this.store.dispatch(addUser({
      user: {
        id: '1',
        name: 'Michael 1',
      }
    }));
    this.store.dispatch(addUser({
      user: {
        id: '2',
        name: 'Gusev 2',
      }
    }));
    this.store.dispatch(addCompany({
      company: {
        id: '3',
        name: 'Company 3',
      }
    }));
    this.store.dispatch(addCompany({
      company: {
        id: '4',
        name: 'Company 4',
      }
    }));
    this.store.dispatch(addAddress({
      address: {
        id: '5',
        name: 'Address 5',
      }
    }));
    this.store.dispatch(addAddress({
      address: {
        id: '6',
        name: 'Address 6',
      }
    }));
  }
}
