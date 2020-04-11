import {Injectable} from '@angular/core';
import {EntityCollectionServiceFactory} from '@ngrx/data';
import {select, Store} from '@ngrx/store';
import {
    childEntity,
    childrenEntities,
    relatedEntity,
    relationships,
    rootEntities,
    rootEntity,
} from 'ngrx-entity-relationship';
import {map, switchMap, tap} from 'rxjs/operators';
import {HeroUuidService} from 'src/app/data/hero-uuid.service';
import {VillainUuidService} from 'src/app/data/villain-uuid.service';
import {Villain} from './data';
import {HeroService} from './hero.service';

@Injectable({providedIn: 'root'})
export class SelectorService {
    constructor(
        protected readonly store: Store<unknown>,
        protected readonly hero: HeroService,
        protected serviceFactory: EntityCollectionServiceFactory,
        protected readonly heroUuid: HeroUuidService,
        protected readonly villainUuid: VillainUuidService,
    ) {}

    public readonly selectHero = rootEntity(
        this.hero,
        relatedEntity(this.serviceFactory.create<Villain>('Villain'), 'villainId', 'villain'),
    );
    public readonly selectHeroes = rootEntities(this.selectHero);
    public readonly heroes$ = this.hero.entities$.pipe(relationships(this.store, this.selectHeroes));

    public readonly selectHeroesWithVillainShort = rootEntities(
        rootEntity(this.hero, relatedEntity(this.serviceFactory.create<Villain>('Villain'), 'villainId', 'villain')),
    );

    public readonly selectHeroWithVillainShort = rootEntity(
        this.hero,
        relatedEntity(this.serviceFactory.create<Villain>('Villain'), 'villainId', 'villain'),
    );

    public readonly selectVillainWithHeroShort = rootEntities(
        rootEntity(this.serviceFactory.create<Villain>('Villain'), childrenEntities(this.hero, 'villainId', 'heroes')),
    );

    public readonly heroesWithVillain$ = this.store.pipe(
        select(this.hero.selectors.selectKeys),
        switchMap(ids => this.store.select(this.selectHeroesWithVillainShort, ids)),
    );

    public readonly heroWithVillainId$ = this.store.pipe(
        select(this.hero.selectors.selectKeys),
        switchMap(() => this.store.select(this.selectHeroWithVillainShort, '12')),
    );

    public readonly heroesWithVillainShort$ = this.hero.entities$.pipe(
        relationships(this.store, this.selectHeroesWithVillainShort),
    );

    public readonly heroesWithVillainShortId$ = this.hero.entities$.pipe(
        map(v => v.shift()),
        relationships(this.store, this.selectHeroWithVillainShort),
    );

    public readonly villainsWithHeroes$ = this.store.pipe(
        select(this.serviceFactory.create<Villain>('Villain').selectors.selectKeys),
        switchMap(ids => this.store.select(this.selectVillainWithHeroShort, ids)),
    );

    public readonly villainsWithHeroesShort$ = this.serviceFactory
        .create<Villain>('Villain')
        .entities$.pipe(relationships(this.store, this.selectVillainWithHeroShort));

    public readonly uuid$ = this.heroUuid.entities$;

    public readonly selectHeroesUuid = rootEntities(
        rootEntity(
            this.heroUuid,
            relatedEntity(
                this.villainUuid,
                'villainId',
                'villain',
                childEntity(this.heroUuid, 'villainId', 'hero'),
                childrenEntities(this.heroUuid, 'villainId', 'heroes'),
            ),
        ),
    );

    public readonly uuidRel$ = this.heroUuid.entities$.pipe(relationships(this.store, this.selectHeroesUuid));

    public readonly store$ = this.store.pipe(tap(v => console.log(v)));
}
