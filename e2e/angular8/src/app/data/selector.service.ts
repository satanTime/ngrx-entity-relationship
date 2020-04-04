import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {childrenEntity, relatedEntity, rootEntities} from 'ngrx-entity-relationship';
import {switchMap} from 'rxjs/operators';
import {DataHeroService} from './data-hero.service';
import {DataVillainService} from './data-villain.service';

@Injectable({providedIn: 'root'})
export class SelectorService {
    constructor(
        protected readonly hero: DataHeroService,
        protected readonly villain: DataVillainService,
        protected readonly store: Store<unknown>,
    ) {}

    public readonly selectHeroesWithVillain = rootEntities(
        this.hero.selectors.selectCollection,
        relatedEntity(this.villain.selectors.selectCollection, 'villainId', 'villain'),
    );
    public readonly selectHeroesWithVillainShort = rootEntities(
        this.hero,
        relatedEntity(this.villain, 'villainId', 'villain'),
    );

    public readonly selectVillainsWithHero = rootEntities(
        this.villain.selectors.selectCollection,
        childrenEntity(this.hero.selectors.selectCollection, 'villainId', 'heroes'),
    );

    public readonly selectVillainsWithHeroShort = rootEntities(
        this.villain,
        childrenEntity(this.hero, 'villainId', 'heroes'),
    );

    public readonly heroesWithVillain$ = this.store.pipe(
        select(this.hero.selectors.selectKeys),
        switchMap(ids => this.store.select(this.selectHeroesWithVillain, ids)),
    );

    public readonly heroesWithVillainShort$ = this.store.pipe(
        select(this.hero.selectors.selectKeys),
        switchMap(ids => this.store.select(this.selectHeroesWithVillainShort, ids)),
    );

    public readonly villainsWithHeroes$ = this.store.pipe(
        select(this.villain.selectors.selectKeys),
        switchMap(ids => this.store.select(this.selectVillainsWithHero, ids)),
    );

    public readonly villainsWithHeroesShort$ = this.store.pipe(
        select(this.villain.selectors.selectKeys),
        switchMap(ids => this.store.select(this.selectVillainsWithHeroShort, ids)),
    );
}
