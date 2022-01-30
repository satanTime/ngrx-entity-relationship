import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EntityDataModule} from '@ngrx/data';
import {Store} from '@ngrx/store';
import {reduceFlat, reduceGraph, rootEntity} from 'ngrx-entity-relationship';

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
    constructor(hero: HeroCollection, villain: VillainCollection, fight: FightCollection, store: Store) {
        hero.addManyToCache([]);
        villain.addManyToCache([]);
        fight.addManyToCache([]);

        store.dispatch(
            reduceGraph({
                data: [
                    {
                        uuid: 'hero1',
                        heroName: 'Hero 1',
                    },
                    {
                        uuid: 'hero2',
                        heroName: 'Hero 2',
                    },
                ],
                selector: rootEntity(hero),
            }),
        );
        store.dispatch(
            reduceGraph({
                data: [
                    {
                        uuid: 'villain3',
                        villainName: 'Villain 3',
                    },
                    {
                        uuid: 'villain4',
                        villainName: 'Villain 4',
                    },
                ],
                selector: rootEntity(villain),
            }),
        );
        store.dispatch(
            reduceFlat({
                data: {
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
                selector: rootEntity(fight, {
                    flatKey: 'fights',
                }),
            }),
        );
    }
}
