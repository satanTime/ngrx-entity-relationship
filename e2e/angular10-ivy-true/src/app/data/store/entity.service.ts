import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {first, map, tap} from 'rxjs/operators';

import {HeroCollection} from './collections/hero.collection';
import {VillainCollection} from './collections/villain.collection';

@Injectable()
export class EntityService {
    constructor(
        protected readonly store: Store<unknown>,
        protected readonly hero: HeroCollection,
        protected readonly villain: VillainCollection,
    ) {}

    public changeHero(id: string): void {
        this.hero.selectors$.collection$
            .pipe(
                map(collection => collection.entities[id]),
                first(),
                tap(entity => {
                    const index = entity.heroName.match(/\d+$/);
                    if (index) {
                        this.hero.updateOneInCache({
                            uuid: id,
                            heroName: `Changed hero ${parseInt(index[0], 10) + 1}`,
                        });
                    }
                }),
            )
            .subscribe();
    }

    public changeVillain(id: string): void {
        this.villain.selectors$.collection$
            .pipe(
                map(collection => collection.entities[id]),
                first(),
                tap(entity => {
                    const index = entity.villainName.match(/\d+$/);
                    if (index) {
                        this.villain.updateOneInCache({
                            uuid: id,
                            villainName: `Changed villain ${parseInt(index[0], 10) + 1}`,
                        });
                    }
                }),
            )
            .subscribe();
    }
}
