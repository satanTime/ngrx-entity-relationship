import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule, rootEffectsInit} from '@ngrx/effects';
import {Store, StoreModule} from '@ngrx/store';
import {EntityComponent} from './entity.component';
import {EntityEffects} from './store/entity.effects';
import {EntityService} from './store/entity.service';
import {reducers} from './store/reducers';

@NgModule({
    declarations: [EntityComponent],
    imports: [
        CommonModule,
        StoreModule.forFeature('addresses', reducers.addresses),
        StoreModule.forFeature('companies', reducers.companies),
        StoreModule.forFeature('users', reducers.users),
        EffectsModule.forFeature([EntityEffects]),
    ],
    providers: [EntityService],
    exports: [EntityComponent],
})
export class EntityModule {
    constructor(private store: Store<unknown>) {
        this.store.dispatch(rootEffectsInit());
    }
}
