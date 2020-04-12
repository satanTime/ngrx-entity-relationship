import {createEntityAdapter} from '@ngrx/entity';

import {childEntity} from '../src';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY, UNKNOWN} from '../src/types';

describe('childEntity', () => {
    type Entity = {
        id: string;
        name: string;
        parentId?: string | number;
        child?: Entity;
    };

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childEntity<any, any, any, any, any>(jasmine.createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childEntity',
            }),
        );
    });

    it('does not set anything if there is no child entity', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity, selector.idSelector);
        expect(entity.child).toBeUndefined();
    });

    it('sets the child entity if it exists', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity, selector.idSelector);
        expect(entity.child).toEqual({
            id: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('clones the child entity', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity, selector.idSelector);
        expect(entity.child).not.toBe(state.feature.entities.id2);
    });

    it('sets the cache when the related entity does not exist', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        const cache = [];
        selector('randChildEntity', state, cache, entity, selector.idSelector);
        expect(cache.length).toBe(1);
        expect(cache[0].length).toBe(4);
        expect(cache[0][0]).toBe('randChildEntity');
        expect(cache[0][1]).toBe(featureSelector);
        expect(cache[0][2]).toBe(null);
        expect(cache[0][3]).toBe(state.feature.entities);
    });

    it('sets the cache when the related entity exists', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        const cache = [];
        selector('randChildEntity', state, cache, entity, selector.idSelector);
        expect(cache.length).toBe(1);
        expect(cache[0].length).toBe(5);
        expect(cache[0][0]).toBe('randChildEntity');
        expect(cache[0][1]).toBe(featureSelector);
        expect(cache[0][2]).toBe('id2');
        expect(cache[0][3]).toBe(state.feature.entities.id2);
        expect(cache[0][4]).toBe(entity.child);
    });

    it('calls relationships with an incrementing prefix and arguments', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        const cache = [];
        selector('randChildEntity', state, cache, entity, selector.idSelector);
        expect(rel1).toHaveBeenCalledWith('randChildEntity:1', state, cache, entity.child, selector.idSelector);
        expect(rel2).toHaveBeenCalledWith('randChildEntity:2', state, cache, entity.child, selector.idSelector);
    });

    it('calls relationships.release on own release call', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('randChildEntity', state, [], entity, selector.idSelector);
        expect(entity.child).toEqual({
            id: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('supports a default selector and returns id field', () => {
        const state = {
            feature: createEntityAdapter<UNKNOWN>().getInitialState(),
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

        selector('randChildEntity', state, [], entity, selector.idSelector);
        expect(entity.child).toEqual({
            id: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('supports custom feature selector and id field of string', () => {
        const state = {
            feature: createEntityAdapter<UNKNOWN>().getInitialState(),
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

        selector('randChildEntity', state, [], entity, selector.idSelector);
        expect(entity.child).toEqual({
            uuid: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('supports custom feature selector and id field of number', () => {
        const state = {
            feature: createEntityAdapter<UNKNOWN>().getInitialState(),
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

        selector('randChildEntity', state, [], entity, selector.idSelector);
        expect(entity.child).toEqual({
            5: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });

    it('supports custom feature selector and id selector', () => {
        const state = {
            feature: createEntityAdapter<UNKNOWN>().getInitialState(),
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

        selector('randChildEntity', state, [], entity, selector.idSelector);
        expect(entity.child).toEqual({
            feature: 'id2',
            name: 'name2',
            parentId: 'id1',
        });
    });
});
