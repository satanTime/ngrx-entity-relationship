import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {rootEntities, toFactorySelector} from 'ngrx-entity-relationship';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {Company} from './store/company/company.model';
import {EntityService} from './store/entity.service';
import {
    relAddressCompany,
    rootCompany,
    relCompanyAddress,
    relCompanyAdmin,
    relCompanyStaff,
    selectCurrentCompanyId,
    selectCurrentUsersIds,
    State,
    rootUser,
    relUserCompany,
    relUserEmployees,
    relUserManager,
} from './store/reducers';
import {User} from './store/user/user.model';

@Component({
    selector: 'app-entity',
    templateUrl: './entity.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityComponent implements OnDestroy {
    public readonly company$: Observable<Company | undefined>;
    // prettier-ignore
    private readonly companyWithCrazyData = toFactorySelector(rootCompany(
        relCompanyAddress(),
        relCompanyAdmin(
            relUserEmployees(),
        ),
        relCompanyStaff(
            relUserCompany(
                relCompanyAddress(
                    relAddressCompany(),
                ),
            ),
        ),
    ));

    public readonly users$: Observable<Array<User>>;
    // prettier-ignore
    private readonly users = toFactorySelector(rootEntities(
        rootUser(
            relUserEmployees(
                relUserManager(),
            ),
            relUserManager(),
        ),
    ));

    constructor(protected readonly store: Store<State>, public readonly entitiesService: EntityService) {
        this.users$ = combineLatest([
            this.store.select(this.users(selectCurrentUsersIds)),
            this.store.pipe(
                select(selectCurrentUsersIds),
                switchMap(ids => this.store.select(this.users(ids))),
            ),
        ]).pipe(
            filter(([a, b]) => a === b),
            map(([a]) => a),
        );

        this.company$ = combineLatest([
            this.store.select(this.companyWithCrazyData(selectCurrentCompanyId)),
            this.store.pipe(
                select(selectCurrentCompanyId),
                switchMap(id => this.store.select(this.companyWithCrazyData(id))),
            ),
        ]).pipe(
            filter(([a, b]) => a === b),
            map(([a]) => a),
        );
    }

    public ngOnDestroy(): void {
        this.users.release();
        this.companyWithCrazyData.release();
    }
}
