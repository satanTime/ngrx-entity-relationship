import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {rootEntities} from 'ngrx-entity-relationship';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Company} from './store/company/company.model';
import {EntityService} from './store/entity.service';
import {
    sAddressCompany,
    sCompany,
    sCompanyAddress,
    sCompanyAdmin,
    sCompanyStaff,
    selectCurrentCompanyId,
    selectCurrentUsersIds,
    State,
    sUser,
    sUserCompany,
    sUserEmployees,
    sUserManager,
} from './store/reducers';
import {User} from './store/user/user.model';

@Component({
    selector: 'app-entity',
    templateUrl: './entity.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityComponent implements OnDestroy {
    public readonly company$: Observable<Company>;
    // prettier-ignore
    private readonly companyWithCrazyData = sCompany(
        sCompanyAddress(),
        sCompanyAdmin(
            sUserEmployees(),
        ),
        sCompanyStaff(
            sUserCompany(
                sCompanyAddress(
                    sAddressCompany(),
                ),
            ),
        ),
    );

    public readonly users$: Observable<Array<User>>;
    // prettier-ignore
    private readonly users = rootEntities(
        sUser(
            sUserEmployees(
                sUserManager(),
            ),
            sUserManager(),
        ),
    );

    constructor(protected readonly store: Store<State>, public readonly entitiesService: EntityService) {
        this.users$ = this.store.pipe(
            select(selectCurrentUsersIds),
            switchMap(ids => this.store.select(this.users, ids)),
        );

        this.company$ = this.store.pipe(
            select(selectCurrentCompanyId),
            switchMap(id => this.store.select(this.companyWithCrazyData, id)),
        );
    }

    public ngOnDestroy(): void {
        this.users.release();
        this.companyWithCrazyData.release();
    }
}
