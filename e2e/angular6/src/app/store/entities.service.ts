import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {first, tap} from 'rxjs/operators';
import {UpdateAddress} from './address/address.actions';
import {UpdateCompany} from './company/company.actions';
import {sAddress, sCompany, State, sUser} from './reducers';
import {UpdateUser} from './user/user.actions';

@Injectable()
export class EntitiesService {
    constructor(protected readonly store: Store<State>) {}

    public changeUser(id: string): void {
        this.store
            .select(sUser(), id)
            .pipe(
                first(),
                tap(entity => {
                    const index = entity.name.match(/\d+$/);
                    if (index) {
                        this.store.dispatch(
                            new UpdateUser({
                                user: {
                                    id,
                                    changes: {
                                        name: `Changed User ${parseInt(index[0], 10) + 1}`,
                                    },
                                },
                            }),
                        );
                    }
                }),
            )
            .subscribe();
    }

    public changeCompany(id: string): void {
        this.store
            .select(sCompany(), id)
            .pipe(
                first(),
                tap(entity => {
                    const index = entity.name.match(/\d+$/);
                    if (index) {
                        this.store.dispatch(
                            new UpdateCompany({
                                company: {
                                    id,
                                    changes: {
                                        name: `Changed Company ${parseInt(index[0], 10) + 1}`,
                                    },
                                },
                            }),
                        );
                    }
                }),
            )
            .subscribe();
    }

    public changeAddress(id: string): void {
        this.store
            .select(sAddress(), id)
            .pipe(
                first(),
                tap(entity => {
                    const index = entity.name.match(/\d+$/);
                    if (index) {
                        this.store.dispatch(
                            new UpdateAddress({
                                address: {
                                    id,
                                    changes: {
                                        name: `Changed Address ${parseInt(index[0], 10) + 1}`,
                                    },
                                },
                            }),
                        );
                    }
                }),
            )
            .subscribe();
    }
}
