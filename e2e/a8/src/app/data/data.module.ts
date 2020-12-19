import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EntityDataModule} from '@ngrx/data';
import {Store} from '@ngrx/store';
import {ReduceFlat, ReduceGraph, rootEntity} from 'ngrx-entity-relationship';

import {DataComponent} from './data.component';
import {FightCollection} from './store/collections/fight.collection';
import {HeroCollection} from './store/collections/hero.collection';
import {VillainCollection} from './store/collections/villain.collection';
import {entityConfig} from './store/config';
import {EntityService} from './store/entity.service';
import {SelectorService} from './store/selector.service';

@NgModule({
    declarations: [DataComponent],
    imports: [CommonModule, EntityDataModule.forRoot(entityConfig)],
    providers: [EntityService, FightCollection, HeroCollection, SelectorService, VillainCollection],
    exports: [DataComponent],
})
export class DataModule {
    constructor(hero: HeroCollection, villain: VillainCollection, fight: FightCollection, store: Store<any>) {
        hero.addManyToCache([]);
        villain.addManyToCache([]);
        fight.addManyToCache([]);

        store.dispatch(
            new ReduceGraph(
                [
                    {
                        uuid: 'hero1',
                        heroName: 'Hero 1',
                    },
                    {
                        uuid: 'hero2',
                        heroName: 'Hero 2',
                    },
                ],
                rootEntity(hero),
            ),
        );
        store.dispatch(
            new ReduceGraph(
                [
                    {
                        uuid: 'villain3',
                        villainName: 'Villain 3',
                    },
                    {
                        uuid: 'villain4',
                        villainName: 'Villain 4',
                    },
                ],
                rootEntity(villain),
            ),
        );
        store.dispatch(
            new ReduceFlat(
                {
                    fights: [
                        {
                            id: '1',
                            heroId: 'hero1',
                            villainId: 'villain4',
                        },
                        {
                            id: '2',
                            heroId: 'hero2',
                            villainId: 'villain3',
                        },
                        {
                            id: '3',
                            heroId: 'hero2',
                            villainId: 'villain4',
                        },
                    ],
                },
                rootEntity(fight, {
                    flatKey: 'fights',
                }),
            ),
        );
    }
}
