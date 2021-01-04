import {FEATURE_SELECTOR, UNKNOWN} from '../src/lib/types';
import {ENTITY_STATE, HANDLER_RELATED_ENTITY, rootEntity, rootEntityFlags} from '../src/public_api';

describe('rootEntity', () => {
    interface Entity {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string;
        children?: Array<Entity>;
    }

    afterEach(() => {
        rootEntityFlags.disabled = false;
    });

    it('marks callback with ngrxEntityRelationship key', () => {
        const rel1 = Symbol() as any;
        const rel2 = Symbol() as any;
        const featureSelector = jasmine.createSpy();
        // because rels aren't real rels we need to pass a transformer.
        const actual = rootEntity(featureSelector, () => null, rel1, rel2);
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual.collectionSelector).toBe(featureSelector);
        expect(actual.ngrxEntityRelationship).toEqual('rootEntity');
        expect(actual.relationships).toEqual([rel1, rel2]);
    });

    it('returns undefined when the id is falsy', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = rootEntity<typeof state, Entity>(v => v.feature);

        expect(selector(state, '')).toBeUndefined();
    });

    it('returns undefined when the entity does not exist', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = rootEntity<typeof state, Entity>(v => v.feature);

        // by default returns undefined.
        expect(selector(state, 'id')).toBeUndefined();
    });

    it('clones the original entity', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                ids: [],
                entities: {},
            },
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
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                ids: [],
                entities: {},
            },
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

    it('returns cached value when the original entity has not been changed unless the cache release', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
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

        // checking that release resets cache.
        selector.release();
        expect(selector(state, 'id1')).not.toBe(entity);
        expect(selector(state, 'id1')).toEqual(entity);
    });

    it('returns cached value when the related entity has not been changed unless the cache release', () => {
        const state: {feature1: ENTITY_STATE<Entity>; feature2: ENTITY_STATE<Entity>} = {
            feature1: {
                ids: [],
                entities: {},
            },
            feature2: {
                ids: [],
                entities: {},
            },
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

        const rel = (jasmine.createSpy().and.callFake((cachePrefix, _, cache) => {
            const relSelector = () => state.feature2;
            cache.set(cachePrefix, new Map());
            cache.get(cachePrefix).set('id2', [new Map(), Symbol()]);
            cache.get(cachePrefix).get('id2')[0].set(relSelector, new Map());
            cache.get(cachePrefix).get('id2')[0].get(relSelector).set('id2', state.feature2.entities.id2);
            return 'id2';
        }) as any) as HANDLER_RELATED_ENTITY<typeof state, Entity>;
        rel.ngrxEntityRelationship = 'spy';
        rel.release = jasmine.createSpy('rel:release');

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

        // checking that release resets cache.
        expect(selector(state, 'id1')).toBe(entity2);
        selector.release();
        expect(selector(state, 'id1')).not.toBe(entity2);
        expect(selector(state, 'id1')).toEqual(entity2);
    });

    it('returns cached value when the related entity set has not been changed unless the cache release', () => {
        const state: {feature1: ENTITY_STATE<Entity>; feature2: ENTITY_STATE<Entity>} = {
            feature1: {
                ids: [],
                entities: {},
            },
            feature2: {
                ids: [],
                entities: {},
            },
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

        const rel = (jasmine.createSpy().and.callFake((cachePrefix, _, cache) => {
            const relSelector = () => state.feature2;
            cache.set(cachePrefix, new Map());
            cache.get(cachePrefix).set('id2', [new Map(), undefined]);
            cache.get(cachePrefix).get('id2')[0].set(relSelector, new Map());
            cache.get(cachePrefix).get('id2')[0].get(relSelector).set(null, state.feature2.entities);
            return 'id2';
        }) as any) as HANDLER_RELATED_ENTITY<typeof state, Entity>;
        rel.ngrxEntityRelationship = 'spy';
        rel.release = jasmine.createSpy('rel:release');

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

        // checking that release resets cache.
        expect(selector(state, 'id1')).toBe(entity2);
        selector.release();
        expect(selector(state, 'id1')).not.toBe(entity2);
        expect(selector(state, 'id1')).toEqual(entity2);
    });

    it('detects another selector as the id parameter', () => {
        const entity = ({
            id: 1,
            unique: Symbol(),
        } as any) as Entity;
        const state = {
            feature: {
                ids: [1],
                entities: {
                    1: entity,
                },
            },
        };
        const selectorIds = jasmine.createSpy().and.returnValue(1);
        const selectorRoot = (jasmine.createSpy().and.returnValue(state.feature) as any) as FEATURE_SELECTOR<
            typeof state,
            Entity
        >;
        const selector = rootEntity(selectorRoot);
        const action = selector(state, selectorIds);
        expect(selectorIds).toHaveBeenCalledWith(state);
        expect(action).toEqual(entity);
    });

    it('calls relationships with an incrementing prefix and arguments', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const rel1 = (jasmine.createSpy() as any) as HANDLER_RELATED_ENTITY<typeof state, Entity>;
        rel1.ngrxEntityRelationship = 'spy';
        const rel2 = (jasmine.createSpy() as any) as HANDLER_RELATED_ENTITY<typeof state, Entity>;
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
        expect(rel1).toHaveBeenCalledWith(
            '0:0',
            state,
            jasmine.anything(),
            (entity as any) as Entity,
            selector.idSelector,
        );
        expect(rel2).toHaveBeenCalledWith(
            '0:1',
            state,
            jasmine.anything(),
            (entity as any) as Entity,
            selector.idSelector,
        );
    });

    it('calls relationships.release on own release call', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const rel1 = (jasmine.createSpy() as any) as HANDLER_RELATED_ENTITY<typeof state, Entity>;
        rel1.ngrxEntityRelationship = 'spy';
        rel1.release = jasmine.createSpy('rel1.release');
        const rel2 = (jasmine.createSpy() as any) as HANDLER_RELATED_ENTITY<typeof state, Entity>;
        rel2.ngrxEntityRelationship = 'spy';
        rel2.release = jasmine.createSpy('rel2.release');

        expect(rel1.release).not.toHaveBeenCalled();
        expect(rel2.release).not.toHaveBeenCalled();
        rootEntity<typeof state, Entity>(v => v.feature, rel1, rel2).release();
        expect(rel1.release).toHaveBeenCalled();
        expect(rel2.release).toHaveBeenCalled();
    });

    it('uses transformer', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const selector = rootEntity<typeof state, Entity, Entity>(
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
            } as any),
        );
    });

    it('uses transformer after relationships', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const transformer = jasmine.createSpy();
        const rel = (jasmine
            .createSpy()
            .and.callFake((_1, _2, _3, v) => (v.processed = true)) as any) as HANDLER_RELATED_ENTITY<
            typeof state,
            Entity
        >;
        rel.ngrxEntityRelationship = 'spy';

        const selector = rootEntity<typeof state, Entity, Entity>(v => v.feature, transformer, rel);

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

    it('uses transformer to a different type', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const transformer = () => 'transformed';
        const rel = (jasmine
            .createSpy()
            .and.callFake((_1, _2, _3, v) => (v.processed = true)) as any) as HANDLER_RELATED_ENTITY<
            typeof state,
            Entity
        >;
        rel.ngrxEntityRelationship = 'spy';

        const selector = rootEntity<typeof state, Entity, string>(v => v.feature, transformer, rel);

        state.feature.entities = {
            ...state.feature.entities,
            id1: {
                id: 'id1',
                name: 'name1',
            },
        };
        const actual = selector(state, 'id1');
        expect(actual).toBe('transformed');
    });

    it('supports EntityCollectionService as a selector', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const idSelector = (v: Entity) => v.id;
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
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                ids: [],
                entities: {},
            },
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
        const state: {feature: ENTITY_STATE<UNKNOWN>} = {
            feature: {
                ids: [],
                entities: {},
            },
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
        const state: {feature: ENTITY_STATE<UNKNOWN>} = {
            feature: {
                ids: [],
                entities: {},
            },
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
        const state: {feature: ENTITY_STATE<UNKNOWN>} = {
            feature: {
                ids: [],
                entities: {},
            },
        };
        const idSelector = (v: Entity) => v.id;
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
