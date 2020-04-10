import {createEntityAdapter} from '@ngrx/entity';

import {childrenEntities} from '../src';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY} from '../src/types';

describe('childrenEntities', () => {
    type Entity = {
        id: string;
        name: string;
        parentId?: string | number;
        child?: Array<Entity>;
    };

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = childrenEntities<any, any, any, any, any>(jasmine.createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'childrenEntities',
            }),
        );
    });

    it('set an empty array if there are no child entities', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = childrenEntities<typeof state, Entity, Entity, 'parentId', 'child'>(
            v => v.feature,
            'parentId',
            'child',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        selector('', state, [], entity);
        expect(entity.child).toEqual([]);
    });

    it('set the children entities if they exist', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = childrenEntities<typeof state, Entity, Entity, 'parentId', 'child'>(
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
            id4: {
                id: 'id4',
                name: 'name4',
                parentId: 'id1',
            },
        };

        selector('', state, [], entity);
        expect(entity.child).toEqual([
            {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
            {
                id: 'id4',
                name: 'name4',
                parentId: 'id1',
            },
        ]);
    });

    it('clones the children entities', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = childrenEntities<typeof state, Entity, Entity, 'parentId', 'child'>(
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

        selector('', state, [], entity);
        expect(entity.child[0]).not.toBe(state.feature.entities.id2);
    });

    it('sets the cache when the children entities do not exist', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const featureSelector: FEATURE_SELECTOR<typeof state, Entity> = v => v.feature;
        const selector = childrenEntities<typeof state, Entity, Entity, 'parentId', 'child'>(
            featureSelector,
            'parentId',
            'child',
        );

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
        };

        const cache = [];
        selector('randChildrenEntities', state, cache, entity);
        expect(cache.length).toBe(1);
        expect(cache[0].length).toBe(4);
        expect(cache[0][0]).toBe('randChildrenEntities');
        expect(cache[0][1]).toBe(featureSelector);
        expect(cache[0][2]).toBe(null);
        expect(cache[0][3]).toBe(state.feature.entities);
    });

    it('sets the cache when the children entities exist', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const featureSelector: FEATURE_SELECTOR<typeof state, Entity> = v => v.feature;
        const selector = childrenEntities<typeof state, Entity, Entity, 'parentId', 'child'>(
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
        selector('randChildrenEntities', state, cache, entity);
        expect(cache.length).toBe(2);

        expect(cache[0].length).toBe(5);
        expect(cache[0][0]).toBe('randChildrenEntities');
        expect(cache[0][1]).toBe(featureSelector);
        expect(cache[0][2]).toBe('id2');
        expect(cache[0][3]).toBe(state.feature.entities.id2);
        expect(cache[0][4]).toBe(entity.child[0]);

        expect(cache[1].length).toBe(4);
        expect(cache[1][0]).toBe('randChildrenEntities');
        expect(cache[1][1]).toBe(featureSelector);
        expect(cache[1][2]).toBe(null);
        expect(cache[1][3]).toBe(state.feature.entities);
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
        const selector = childrenEntities<typeof state, Entity, Entity, 'parentId', 'child'>(
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
        selector('randChildrenEntities', state, cache, entity);
        expect(rel1).toHaveBeenCalledWith('randChildrenEntities:1', state, cache, entity.child[0]);
        expect(rel2).toHaveBeenCalledWith('randChildrenEntities:2', state, cache, entity.child[0]);
    });

    it('supports EntityCollectionService as a selector', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = childrenEntities<typeof state, Entity, Entity, 'parentId', 'child'>(
            {
                selectors: {
                    selectCollection: v => v.feature,
                },
            },
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
        selector('randChildrenEntities', state, cache, entity);
        expect(entity.child).toEqual([
            {
                id: 'id2',
                name: 'name2',
                parentId: 'id1',
            },
        ]);
    });
});
