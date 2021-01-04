import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {childrenEntities, relatedEntity, rootEntities, rootEntity} from 'ngrx-entity-relationship';
import {relationships} from 'ngrx-entity-relationship/rxjs';

import {FightCollection} from './collections/fight.collection';
import {HeroCollection} from './collections/hero.collection';
import {VillainCollection} from './collections/villain.collection';

@Injectable()
export class SelectorService {
    constructor(
        protected readonly store: Store<unknown>,
        protected readonly fight: FightCollection,
        protected readonly hero: HeroCollection,
        protected readonly villain: VillainCollection,
    ) {}

    // selecting all fights with related hero and villain.
    // prettier-ignore
    public readonly fights$ = this.fight.selectors$.entities$.pipe(
        relationships(
            this.store,
            rootEntities(
                rootEntity(
                    this.fight,
                    relatedEntity(this.hero, 'heroId', 'hero'),
                    relatedEntity(this.villain, 'villainId', 'villain'),
                ),
            ),
        ),
    );

    // selecting all heroes with their fights and villains.
    // prettier-ignore
    public readonly heroes$ = this.hero.selectors$.entities$.pipe(
        relationships(
            this.store,
            rootEntities(
                rootEntity(
                    this.hero,
                    childrenEntities(
                        this.fight, 'heroId', 'fights',
                        relatedEntity(this.villain, 'villainId', 'villain'),
                    ),
                ),
            ),
        ),
    );

    // selecting all villains with their fights and heroes.
    // prettier-ignore
    public readonly villains$ = this.villain.selectors$.entities$.pipe(
        relationships(
            this.store,
            rootEntities(
                rootEntity(
                    this.villain,
                    childrenEntities(
                        this.fight, 'villainId', 'fights',
                        relatedEntity(this.hero, 'heroId', 'hero'),
                    ),
                ),
            ),
        ),
    );
}
