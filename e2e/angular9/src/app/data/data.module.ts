import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EntityDataModule} from '@ngrx/data';

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
    constructor(hero: HeroCollection, villain: VillainCollection, fight: FightCollection) {
        hero.addOneToCache({
            uuid: 'hero1',
            heroName: 'Hero 1',
        });
        hero.addOneToCache({
            uuid: 'hero2',
            heroName: 'Hero 2',
        });
        villain.addOneToCache({
            uuid: 'villain3',
            villainName: 'Villain 3',
        });
        villain.addOneToCache({
            uuid: 'villain4',
            villainName: 'Villain 4',
        });
        fight.addOneToCache({
            id: '1',
            heroId: 'hero1',
            villainId: 'villain4',
        });
        fight.addOneToCache({
            id: '2',
            heroId: 'hero2',
            villainId: 'villain3',
        });
        fight.addOneToCache({
            id: '3',
            heroId: 'hero2',
            villainId: 'villain4',
        });
    }
}
