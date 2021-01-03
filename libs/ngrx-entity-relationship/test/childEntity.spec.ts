import {childEntity, ENTITY_STATE, FEATURE_SELECTOR, HANDLER_RELATED_ENTITY} from 'ngrx-entity-relationship';
import {UNKNOWN} from 'ngrx-entity-relationship/lib/types';

describe('childEntity', () => {
    type Entity = {
        id: string;
        name: string;
        parentId?: string | number;
        child?: Entity;
    };

    it('marks callback with ngrxEntityRelationship key and passed args', () => {
        const rel1: any = Symbol();
        const rel2: any = Symbol();
        const featureSelector = jasmine.createSpy();
        const actual = childEntity<any, any, any, any, any>(featureSelector, 'myKeyId', 'myKeyValue', rel1, rel2);
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual.ngrxEntityRelationship).toEqual('childEntity');
        expect(actual.collectionSelector).toBe(featureSelector);
        expect(actual.keyId).toEqual('myKeyId');
        expect(actual.keyValue).toEqual('myKeyValue');
        expect(actual.relationships).toEqual([rel1, rel2]);
    });

    it('does not set anything if there is no child entity', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            v => v.feature,
            'parentId',
            'child',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.child).toBeUndefined();
    });

    it('sets the child entity if it exists', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            v => v.feature,
            'parentId',
            'child',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id3: {
                // should be ignored because parentId has a wrong value.
                id: 'id3',
                name: 'name3',
                parentId: 'id2',
            },
            id2: {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.child).toEqual({
            id: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('clones the child entity', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            v => v.feature,
            'parentId',
            'child',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.child).not.toBe(state.feature.entities.id2);
    });

    it('sets the cache when the related entity does not exist', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const featureSelector: FEATURE_SELECTOR<typeof state, Entity> = v => v.feature;
        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            featureSelector,
            'parentId',
            'child',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        const cache = new Map();
        selector('randChildEntity', state, cache, entity, selector.idSelector);
        expect(cache.size).toBe(1);
        expect(cache.get('randChildEntity').get('!id1')[0].size).toBe(1);
        expect(cache.get('randChildEntity').get('!id1')[0].get(featureSelector).size).toBe(1);
        expect(cache.get('randChildEntity').get('!id1')[0].get(featureSelector).get(null)).toBe(state.feature.entities);
        expect(cache.get('randChildEntity').get('!id1')[1]).toBeUndefined();
    });

    it('sets the cache when the related entity exists', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const featureSelector: FEATURE_SELECTOR<typeof state, Entity> = v => v.feature;
        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            featureSelector,
            'parentId',
            'child',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        const cache = new Map();
        selector('randChildEntity', state, cache, entity, selector.idSelector);
        expect(cache.size).toBe(1);
        expect(cache.get('randChildEntity').get('!id1')[0].size).toBe(1);
        expect(cache.get('randChildEntity').get('!id1')[0].get(featureSelector).size).toBe(1);
        expect(cache.get('randChildEntity').get('!id1')[0].get(featureSelector).get(null)).toBe(state.feature.entities);
        expect(cache.get('randChildEntity').get('!id1')[1]).toBe('id2');
        expect(cache.get('randChildEntity').get('#id2')[0].size).toBe(1);
        expect(cache.get('randChildEntity').get('#id2')[0].get(featureSelector).size).toBe(2);
        expect(cache.get('randChildEntity').get('#id2')[0].get(featureSelector).get(null)).toBe(state.feature.entities);
        expect(cache.get('randChildEntity').get('#id2')[0].get(featureSelector).get('id2')).toBe(
            state.feature.entities.id2,
        );
        expect(cache.get('randChildEntity').get('#id2')[1]).not.toBe(state.feature.entities.id2);
        expect(cache.get('randChildEntity').get('#id2')[1]).toEqual(state.feature.entities.id2);
    });

    it('calls relationships with an incrementing prefix and arguments', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy('rel1');
        rel1.ngrxEntityRelationship = 'spy';
        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy('rel2');
        rel2.ngrxEntityRelationship = 'spy';

        const featureSelector: FEATURE_SELECTOR<typeof state, Entity> = v => v.feature;
        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            featureSelector,
            'parentId',
            'child',
            rel1,
            rel2,
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        const cache = new Map();
        selector('randChildEntity', state, cache, entity, selector.idSelector);
        expect(rel1).toHaveBeenCalledWith('randChildEntity:0', state, cache, entity.child, selector.idSelector);
        expect(rel2).toHaveBeenCalledWith('randChildEntity:1', state, cache, entity.child, selector.idSelector);
    });

    it('respects cache of relationships', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel1');
        rel1.ngrxEntityRelationship = 'spy';
        rel1.and.callFake((cacheKey, _2, cacheSet) => {
            const result = new Map();
            result.set('rel1selector', new Map());

            const hashMap = new Map();
            cacheSet.set(cacheKey, hashMap);
            hashMap.set('rel1', [result, undefined]);

            return 'rel1';
        });
        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel2');
        rel2.ngrxEntityRelationship = 'spy';
        rel2.and.callFake((cacheKey, _2, cacheSet) => {
            const result = new Map();
            result.set('rel2selector', new Map());

            const hashMap = new Map();
            cacheSet.set(cacheKey, hashMap);
            hashMap.set('rel2', [result, undefined]);

            return 'rel2';
        });

        const featureSelector: FEATURE_SELECTOR<typeof state, Entity> = v => v.feature;
        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            featureSelector,
            'parentId',
            'child',
            rel1,
            rel2,
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        const cache = new Map();
        selector('randChildEntity', state, cache, entity, selector.idSelector);
        expect(cache.get('randChildEntity').get('#id2')[0].has('rel1selector')).toBe(true);
        expect(cache.get('randChildEntity').get('#id2')[0].has('rel2selector')).toBe(true);
    });

    it('calls relationships.release on own release call', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy('rel1');
        rel1.ngrxEntityRelationship = 'spy';
        rel1.release = jasmine.createSpy('rel1.release');
        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy('rel2');
        rel2.ngrxEntityRelationship = 'spy';
        rel2.release = jasmine.createSpy('rel2.release');

        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            v => v.feature,
            'parentId',
            'child',
            rel1,
            rel2,
        );

        expect(rel1.release).not.toHaveBeenCalled();
        expect(rel2.release).not.toHaveBeenCalled();
        selector.release();
        expect(rel1.release).toHaveBeenCalled();
        expect(rel2.release).toHaveBeenCalled();
    });

    it('supports EntityCollectionService as a selector', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const idSelector = v => v.id;
        const selector = childEntity<typeof state, Entity, Entity, 'parentId', 'child'>(
            {
                selectors: {
                    selectCollection: v => v.feature,
                },
                selectId: idSelector,
            },
            'parentId',
            'child',
        );
        expect(selector.idSelector).toBe(idSelector);

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        selector('randChildEntity', state, new Map(), entity, selector.idSelector);
        expect(entity.child).toEqual({
            id: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('supports a default selector and returns id field', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = childEntity<typeof state, UNKNOWN, UNKNOWN, 'parentId', 'child'>(
            v => v.feature,
            'parentId',
            'child',
        );
        expect(selector.idSelector({id: 'myId'})).toBe('myId');

        const entity = {
            id: 'id1',
            name: 'name1',
            child: undefined,
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        selector('randChildEntity', state, new Map(), entity, selector.idSelector);
        expect(entity.child).toEqual({
            id: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('supports custom feature selector and id field of string', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = childEntity<typeof state, UNKNOWN, UNKNOWN, 'parentId', 'child'>(
            {
                collection: v => v.feature,
                id: 'uuid',
            },
            'parentId',
            'child',
        );
        expect(selector.idSelector({uuid: 'myId'})).toBe('myId');

        const entity = {
            uuid: 'id1',
            name: 'name1',
            child: undefined,
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                uuid: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        selector('randChildEntity', state, new Map(), entity, selector.idSelector);
        expect(entity.child).toEqual({
            uuid: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('supports custom feature selector and id field of number', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = childEntity<typeof state, UNKNOWN, UNKNOWN, 'parentId', 'child'>(
            {
                collection: v => v.feature,
                id: 5,
            },
            'parentId',
            'child',
        );
        expect(selector.idSelector({5: 'myId'})).toBe('myId');

        const entity = {
            5: 'id1',
            name: 'name1',
            child: undefined,
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                5: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        selector('randChildEntity', state, new Map(), entity, selector.idSelector);
        expect(entity.child).toEqual({
            5: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('supports custom feature selector and id selector', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const idSelector = v => v.feature;
        const selector = childEntity<typeof state, UNKNOWN, UNKNOWN, 'parentId', 'child'>(
            {
                collection: v => v.feature,
                id: idSelector,
            },
            'parentId',
            'child',
        );
        expect(selector.idSelector).toBe(idSelector);

        const entity = {
            feature: 'id1',
            name: 'name1',
            child: undefined,
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                feature: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        };

        selector('randChildEntity', state, new Map(), entity, selector.idSelector);
        expect(entity.child).toEqual({
            feature: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });
});
