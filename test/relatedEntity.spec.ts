import {relatedEntity} from '../src';
import {ENTITY_STATE, FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, UNKNOWN} from '../src/types';

describe('relatedEntity', () => {
    type Entity = {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string | number;
        parents?: Array<Entity>;
        parentsId?: Array<string | number>;
    };

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = relatedEntity<any, any, any, any, any, any, any>(jasmine.createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'relatedEntity',
            }),
        );
    });

    it('does not set anything if the related id is falsy', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            v => v.feature,
            'parentId',
            'parent',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toBeUndefined();

        entity.parentId = '';
        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toBeUndefined();

        entity.parentId = 0;
        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toBeUndefined();
    });

    it('sets the related entity if the related id field has primitive type', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            v => v.feature,
            'parentId',
            'parent',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual({
            id: 'id2',
            name: 'name2',
        });
    });

    it('sets an array of the related entities the related id field is an array', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, Entity, Entity, never, 'parentsId', never, 'parents'>(
            v => v.feature,
            'parentsId',
            'parents',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentsId: ['id2'],
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parents).toEqual([
            {
                id: 'id2',
                name: 'name2',
            },
        ]);
    });

    it('sets undefined when the related entity does not exist', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            v => v.feature,
            'parentId',
            'parent',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toBeUndefined();
    });

    it('sets an empty when the related entities do not exist', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, Entity, Entity, never, 'parentsId', never, 'parents'>(
            v => v.feature,
            'parentsId',
            'parents',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentsId: ['id2'],
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parents).toEqual([]);
    });

    it('clones the related entity', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            v => v.feature,
            'parentId',
            'parent',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual(state.feature.entities.id2);
        expect(entity.parent).not.toBe(state.feature.entities.id2);
    });

    it('clones the related entities for arrays', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, Entity, Entity, never, 'parentsId', never, 'parents'>(
            v => v.feature,
            'parentsId',
            'parents',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentsId: ['id2'],
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parents[0]).toEqual(state.feature.entities.id2);
        expect(entity.parents[0]).not.toBe(state.feature.entities.id2);
    });

    it('sets the cache when the related entity exists', () => {
        const state: {feature: ENTITY_STATE<Entity>} = {
            feature: {
                entities: {},
            },
        };
        const featureSelector: FEATURE_SELECTOR<typeof state, Entity> = v => v.feature;
        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            featureSelector,
            'parentId',
            'parent',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        const cache = new Map();
        selector('randRelatedEntity', state, cache, entity, selector.idSelector);
        expect(cache.size).toBe(1);
        expect(cache.get('randRelatedEntity').size).toBe(2);
        expect(cache.get('randRelatedEntity').get('#id2')[0].size).toBe(1);
        expect(cache.get('randRelatedEntity').get('#id2')[0].get(featureSelector).size).toBe(2);
        expect(cache.get('randRelatedEntity').get('#id2')[0].get(featureSelector).get(null)).toBe(
            state.feature.entities,
        );
        expect(cache.get('randRelatedEntity').get('#id2')[0].get(featureSelector).get('id2')).toBe(
            state.feature.entities.id2,
        );
        expect(cache.get('randRelatedEntity').get('#id2')[1]).not.toBe(state.feature.entities.id2);
        expect(cache.get('randRelatedEntity').get('#id2')[1]).toEqual(state.feature.entities.id2);
        expect(cache.get('randRelatedEntity').get('#id2:id2')[0].size).toBe(1);
        expect(cache.get('randRelatedEntity').get('#id2:id2')[0].get(featureSelector).size).toBe(2);
        expect(cache.get('randRelatedEntity').get('#id2:id2')[0].get(featureSelector).get(null)).toBe(
            state.feature.entities,
        );
        expect(cache.get('randRelatedEntity').get('#id2:id2')[0].get(featureSelector).get('id2')).toBe(
            state.feature.entities.id2,
        );
        expect(cache.get('randRelatedEntity').get('#id2:id2')[1]).not.toBe(state.feature.entities.id2);
        expect(cache.get('randRelatedEntity').get('#id2:id2')[1]).toEqual(state.feature.entities.id2);
    });

    it('sets the cache when the related entity does not exist', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const featureSelector: FEATURE_SELECTOR<typeof state, Entity> = v => v.feature;
        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            featureSelector,
            'parentId',
            'parent',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };

        const cache = new Map();
        selector('randRelatedEntity', state, cache, entity, selector.idSelector);
        expect(cache.size).toBe(1);
        expect(cache.get('randRelatedEntity').size).toBe(1);
        expect(cache.get('randRelatedEntity').get('#id2')[0].size).toBe(1);
        expect(cache.get('randRelatedEntity').get('#id2')[0].get(featureSelector).size).toBe(2);
        expect(cache.get('randRelatedEntity').get('#id2')[0].get(featureSelector).get(null)).toBe(
            state.feature.entities,
        );
        expect(cache.get('randRelatedEntity').get('#id2')[0].get(featureSelector).get('id2')).toBeUndefined();
        expect(cache.get('randRelatedEntity').get('#id2')[1]).toBeUndefined();
    });

    it('calls relationships with an incrementing prefix and arguments', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy();
        rel1.ngrxEntityRelationship = 'spy';
        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy();
        rel2.ngrxEntityRelationship = 'spy';

        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            {
                selectors: {
                    selectCollection: v => v.feature,
                },
                selectId: v => v.id,
            },
            'parentId',
            'parent',
            rel1,
            rel2,
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        const cache = new Map();
        selector('randRelatedEntity', state, cache, entity, selector.idSelector);
        expect(rel1).toHaveBeenCalledWith('randRelatedEntity:0', state, cache, entity.parent, selector.idSelector);
        expect(rel2).toHaveBeenCalledWith('randRelatedEntity:1', state, cache, entity.parent, selector.idSelector);
    });

    it('calls relationships.release on own release call', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy();
        rel1.ngrxEntityRelationship = 'spy';
        rel1.release = jasmine.createSpy('rel1.release');
        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> = <any>jasmine.createSpy();
        rel2.ngrxEntityRelationship = 'spy';
        rel2.release = jasmine.createSpy('rel2.release');

        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            v => v.feature,
            'parentId',
            'parent',
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
                entities: {},
            },
        };
        const idSelector = v => v.id;
        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            {
                selectors: {
                    selectCollection: v => v.feature,
                },
                selectId: idSelector,
            },
            'parentId',
            'parent',
        );
        expect(selector.idSelector).toBe(idSelector);

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual({
            id: 'id2',
            name: 'name2',
        });
    });

    it('supports a default selector and returns id field', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, UNKNOWN, UNKNOWN, 'parentId', never, 'parent', never>(
            v => v.feature,
            'parentId',
            'parent',
        );
        expect(selector.idSelector({id: 'myId'})).toBe('myId');

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual({
            id: 'id2',
            name: 'name2',
        });
    });

    it('supports custom feature selector and id field of string', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, UNKNOWN, UNKNOWN, 'parentId', never, 'parent', never>(
            {
                collection: v => v.feature,
                id: 'uuid',
            },
            'parentId',
            'parent',
        );
        expect(selector.idSelector({uuid: 'myId'})).toBe('myId');

        const entity = {
            uuid: 'id1',
            name: 'name1',
            parent: undefined,
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                uuid: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual({
            uuid: 'id2',
            name: 'name2',
        });
    });

    it('supports custom feature selector and id field of number', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const selector = relatedEntity<typeof state, UNKNOWN, UNKNOWN, 'parentId', never, 'parent', never>(
            {
                collection: v => v.feature,
                id: 5,
            },
            'parentId',
            'parent',
        );
        expect(selector.idSelector({5: 'myId'})).toBe('myId');

        const entity = {
            5: 'id1',
            name: 'name1',
            parent: undefined,
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                5: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual({
            5: 'id2',
            name: 'name2',
        });
    });

    it('supports custom feature selector and id selector', () => {
        const state = {
            feature: {
                entities: {},
            },
        };
        const idSelector = v => v.feature;
        const selector = relatedEntity<typeof state, UNKNOWN, UNKNOWN, 'parentId', never, 'parent', never>(
            {
                collection: v => v.feature,
                id: idSelector,
            },
            'parentId',
            'parent',
        );
        expect(selector.idSelector).toBe(idSelector);

        const entity = {
            feature: 'id1',
            name: 'name1',
            parent: undefined,
            parentId: 'id2',
        };

        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                feature: 'id2',
                name: 'name2',
            },
        };

        selector('', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual({
            feature: 'id2',
            name: 'name2',
        });
    });
});
