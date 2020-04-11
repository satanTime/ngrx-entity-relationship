import {createEntityAdapter} from '@ngrx/entity';

import {rootEntity, rootEntityFlags} from '../src';
import {HANDLER_RELATED_ENTITY, UNKNOWN} from '../src/types';

describe('rootEntity', () => {
    type Entity = {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string;
        children?: Array<Entity>;
    };

    afterEach(() => {
        rootEntityFlags.disabled = false;
    });

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = rootEntity(jasmine.createSpy());
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'rootEntity',
            }),
        );
    });

    it('returns undefined when the entity does not exist', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = rootEntity<typeof state, Entity>(v => v.feature);

        // by default returns undefined.
        expect(selector(state, 'id')).toBeUndefined();
    });

    it('clones the original entity', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = rootEntity<typeof state, Entity>(v => v.feature);

        // when we have an entity we should get its copy.
        state.feature.entities = {
            ...state.feature.entities,
            id: {
                id: 'id',
                name: 'name',
            },
        };
        const entity = selector(state, 'id');
        expect(entity).not.toBe(state.feature.entities.id);
        expect(entity).toEqual(state.feature.entities.id);
    });

    it('returns cached value when rootEntityFlags.disabled is true', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = rootEntity<typeof state, Entity>(v => v.feature);

        // when we have an entity we should get its copy.
        state.feature.entities = {
            ...state.feature.entities,
            id: {
                id: 'id',
                name: 'name1',
            },
        };
        const entity1 = selector(state, 'id');
        expect(entity1).not.toBe(state.feature.entities.id);
        expect(entity1).toEqual(state.feature.entities.id);

        // when we update an entity we should get its updated copy.
        state.feature.entities = {
            ...state.feature.entities,
            id: {
                id: 'id',
                name: 'name2',
            },
        };
        const entity2 = selector(state, 'id');
        expect(entity2).not.toBe(state.feature.entities.id);
        expect(entity2).toEqual(state.feature.entities.id);
        expect(entity2).not.toBe(entity1);

        // the case.
        rootEntityFlags.disabled = true;

        // when we update an entity we should get its updated copy.
        state.feature.entities = {
            ...state.feature.entities,
            id: {
                id: 'id',
                name: 'name3',
            },
        };
        const entity3 = selector(state, 'id');
        expect(entity3).toBe(entity2);

        // the case.
        rootEntityFlags.disabled = false;

        // when we update an entity we should get its updated copy.
        const entity4 = selector(state, 'id');
        expect(entity4).not.toBe(state.feature.entities.id);
        expect(entity4).toEqual(state.feature.entities.id);
        expect(entity4).not.toBe(entity3);
    });

    it('returns cached value when the original entity has not been changed', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = rootEntity<typeof state, Entity>(v => v.feature);

        state.feature.entities = {
            ...state.feature.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        const entity = selector(state, 'id1');

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };
        expect(selector(state, 'id1')).toBe(entity);
    });

    it('returns cached value when the related entity has not been changed', () => {
        const state = {
            feature1: createEntityAdapter<Entity>().getInitialState(),
            feature2: createEntityAdapter<Entity>().getInitialState(),
        };

        state.feature1.entities = {
            ...state.feature1.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        state.feature2.entities = {
            ...state.feature2.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        const rel = <jasmine.Spy & HANDLER_RELATED_ENTITY<typeof state, Entity>>(<any>jasmine.createSpy());
        rel.ngrxEntityRelationship = 'spy';
        rel.and.callFake((cachePrefix, currentState, cache) => {
            const symbol = Symbol();
            cache.push([cachePrefix, () => state.feature2, 'id2', state.feature2.entities.id2]);
        });

        const selector = rootEntity<typeof state, Entity>(v => v.feature1, rel);

        const entity1 = selector(state, 'id1');
        expect(entity1).toEqual(state.feature1.entities.id1);

        state.feature2.entities = {
            ...state.feature2.entities,
            id3: {
                id: 'id3',
                name: 'name3',
            },
        };
        expect(selector(state, 'id1')).toEqual(entity1);

        state.feature2.entities = {
            ...state.feature2.entities,
            id2: {
                id: 'id2',
                name: 'name2.1',
            },
        };
        const entity2 = selector(state, 'id1');
        expect(entity2).not.toBe(entity1);
        expect(entity2).toEqual(state.feature1.entities.id1);
    });

    it('returns cached value when the related entity set has not been changed', () => {
        const state = {
            feature1: createEntityAdapter<Entity>().getInitialState(),
            feature2: createEntityAdapter<Entity>().getInitialState(),
        };

        state.feature1.entities = {
            ...state.feature1.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        state.feature2.entities = {
            ...state.feature2.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        const rel = <jasmine.Spy & HANDLER_RELATED_ENTITY<typeof state, Entity>>(<any>jasmine.createSpy());
        rel.ngrxEntityRelationship = 'spy';
        rel.and.callFake((cachePrefix, currentState, cache) => {
            const symbol = Symbol();
            cache.push([cachePrefix, () => state.feature2, undefined, state.feature2.entities]);
        });

        const selector = rootEntity<typeof state, Entity>(v => v.feature1, rel);

        const entity1 = selector(state, 'id1');
        expect(entity1).toEqual(state.feature1.entities.id1);

        state.feature1.entities = {
            ...state.feature1.entities,
            id3: {
                id: 'id3',
                name: 'name3',
            },
        };
        expect(selector(state, 'id1')).toEqual(entity1);

        state.feature2.entities = {
            ...state.feature2.entities,
        };
        const entity2 = selector(state, 'id1');
        expect(entity2).not.toBe(entity1);
        expect(entity2).toEqual(state.feature1.entities.id1);
    });

    it('calls relationships with an incrementing prefix and arguments', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy();
        rel1.ngrxEntityRelationship = 'spy';
        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy();
        rel2.ngrxEntityRelationship = 'spy';

        const selector = rootEntity<typeof state, Entity>(v => v.feature, rel1, rel2);

        state.feature.entities = {
            ...state.feature.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        const entity = selector(state, 'id1');
        expect(rel1).toHaveBeenCalledWith('1', state, jasmine.anything(), entity, selector.idSelector);
        expect(rel2).toHaveBeenCalledWith('2', state, jasmine.anything(), entity, selector.idSelector);
    });

    it('uses transformer', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = rootEntity<typeof state, Entity>(
            v => v.feature,
            entity => ({...entity, transformed: true}),
        );

        state.feature.entities = {
            ...state.feature.entities,
            id: {
                id: 'id',
                name: 'name',
            },
        };
        expect(selector(state, 'id')).toEqual(
            jasmine.objectContaining({
                transformed: true,
            }),
        );
    });

    it('uses transformer after relationships', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const transformer = jasmine.createSpy();
        const rel = <jasmine.Spy & HANDLER_RELATED_ENTITY<typeof state, Entity>>(<any>jasmine.createSpy());
        rel.ngrxEntityRelationship = 'spy';
        rel.and.callFake((_1, _2, _3, v) => (v.processed = true));

        const selector = rootEntity<typeof state, Entity>(v => v.feature, transformer, rel);

        state.feature.entities = {
            ...state.feature.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        selector(state, 'id1');
        expect(transformer).toHaveBeenCalledWith(
            jasmine.objectContaining({
                processed: true,
            }),
        );
    });

    it('supports EntityCollectionService as a selector', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const idSelector = v => v.id;
        const selector = rootEntity<typeof state, Entity>({
            selectors: {
                selectCollection: v => v.feature,
            },
            selectId: idSelector,
        });
        expect(selector.idSelector).toBe(idSelector);

        state.feature.entities = {
            ...state.feature.entities,
            id: {
                id: 'id',
                name: 'name',
            },
        };
        const entity = selector(state, 'id');
        expect(entity).toEqual(state.feature.entities.id);
    });

    it('supports a default selector and returns id field', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = rootEntity<typeof state, Entity>(v => v.feature);
        expect(selector.idSelector({id: 'myId', name: 'myName'})).toBe('myId');

        state.feature.entities = {
            ...state.feature.entities,
            id: {
                id: 'id',
                name: 'name',
            },
        };
        const entity = selector(state, 'id');
        expect(entity).toEqual(state.feature.entities.id);
    });

    it('supports custom feature selector and id field of string', () => {
        const state = {
            feature: createEntityAdapter<UNKNOWN>().getInitialState(),
        };
        const selector = rootEntity<typeof state, UNKNOWN>({
            collection: v => v.feature,
            id: 'uuid',
        });
        expect(selector.idSelector({uuid: 'myId'})).toBe('myId');

        state.feature.entities = {
            ...state.feature.entities,
            id: {
                uuid: 'id',
                name: 'name',
            },
        };
        const entity = selector(state, 'id');
        expect(entity).toEqual(state.feature.entities.id);
    });

    it('supports custom feature selector and id field of number', () => {
        const state = {
            feature: createEntityAdapter<UNKNOWN>().getInitialState(),
        };
        const selector = rootEntity<typeof state, UNKNOWN>({
            collection: v => v.feature,
            id: 5,
        });
        expect(selector.idSelector({5: 'myId'})).toBe('myId');

        state.feature.entities = {
            ...state.feature.entities,
            id: {
                5: 'id',
                name: 'name',
            },
        };
        const entity = selector(state, 'id');
        expect(entity).toEqual(state.feature.entities.id);
    });

    it('supports custom feature selector and id selector', () => {
        const state = {
            feature: createEntityAdapter<UNKNOWN>().getInitialState(),
        };
        const idSelector = v => v.feature;
        const selector = rootEntity<typeof state, UNKNOWN>({
            collection: v => v.feature,
            id: idSelector,
        });
        expect(selector.idSelector).toBe(idSelector);

        state.feature.entities = {
            ...state.feature.entities,
            id: {
                feature: 'id',
                name: 'name',
            },
        };
        const entity = selector(state, 'id');
        expect(entity).toEqual(state.feature.entities.id);
    });
});
