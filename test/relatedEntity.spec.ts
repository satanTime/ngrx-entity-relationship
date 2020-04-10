import {createEntityAdapter} from '@ngrx/entity';

import {relatedEntity} from '../src';
import {FEATURE_SELECTOR, HANDLER_RELATED_ENTITY} from '../src/types';

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
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity);
        expect(entity.parent).toBeUndefined();

        entity.parentId = '';
        selector('', state, [], entity);
        expect(entity.parent).toBeUndefined();

        entity.parentId = 0;
        selector('', state, [], entity);
        expect(entity.parent).toBeUndefined();
    });

    it('sets the related entity if the related id field has primitive type', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity);
        expect(entity.parent).toEqual({
            id: 'id2',
            name: 'name2',
        });
    });

    it('sets an array of the related entities the related id field is an array', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity);
        expect(entity.parents).toEqual([
            {
                id: 'id2',
                name: 'name2',
            },
        ]);
    });

    it('sets undefined when the related entity does not exist', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity);
        expect(entity.parent).toBeUndefined();
    });

    it('sets an empty when the related entities do not exist', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity);
        expect(entity.parents).toEqual([]);
    });

    it('clones the related entity', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity);
        expect(entity.parent).toEqual(state.feature.entities.id2);
        expect(entity.parent).not.toBe(state.feature.entities.id2);
    });

    it('clones the related entities for arrays', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        selector('', state, [], entity);
        expect(entity.parents[0]).toEqual(state.feature.entities.id2);
        expect(entity.parents[0]).not.toBe(state.feature.entities.id2);
    });

    it('sets the cache when the related entity exists', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        const cache = [];
        selector('randRelatedEntity', state, cache, entity);
        expect(cache[0].length).toBe(5);
        expect(cache[0][0]).toBe('randRelatedEntity');
        expect(cache[0][1]).toBe(featureSelector);
        expect(cache[0][2]).toBe('id2');
        expect(cache[0][3]).toBe(state.feature.entities.id2);
        expect(cache[0][4]).toBe(entity.parent);
    });

    it('sets the cache when the related entity does not exist', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        const cache = [];
        selector('randRelatedEntity', state, cache, entity);
        expect(cache[0].length).toBe(4);
        expect(cache[0][0]).toBe('randRelatedEntity');
        expect(cache[0][1]).toBe(featureSelector);
        expect(cache[0][2]).toBe('id2');
        expect(cache[0][3]).toBe(undefined);
    });

    it('calls relationships with an incrementing prefix and arguments', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
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

        const cache = [];
        selector('randRelatedEntity', state, cache, entity);
        expect(rel1).toHaveBeenCalledWith('randRelatedEntity:1', state, cache, entity.parent);
        expect(rel2).toHaveBeenCalledWith('randRelatedEntity:2', state, cache, entity.parent);
    });

    it('supports EntityCollectionService as a selector', () => {
        const state = {
            feature: createEntityAdapter<Entity>().getInitialState(),
        };
        const selector = relatedEntity<typeof state, Entity, Entity, 'parentId', never, 'parent', never>(
            {
                selectors: {
                    selectCollection: v => v.feature,
                },
            },
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

        selector('', state, [], entity);
        expect(entity.parent).toEqual({
            id: 'id2',
            name: 'name2',
        });
    });
});
